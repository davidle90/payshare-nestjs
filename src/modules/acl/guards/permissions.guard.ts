import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "../permissions/permission.types";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<Permission[]>(
      'permissions',
      ctx.getHandler(),
    );

    if (!required) return true;

    const { user } = ctx.switchToHttp().getRequest();

    return required.every(p =>
      user.permissions?.includes(p),
    );
  }
}
