import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Policy } from "../interfaces/policy.interface";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext) {
    const handlerPolicies =
      this.reflector.get<Policy[]>('policies', ctx.getHandler());

    if (!handlerPolicies) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const resource = req.resource;

    return handlerPolicies.every(policy =>
      policy.canRead
        ? policy.canRead(user, resource)
        : true,
    );
  }
}
