import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser; // type assertion

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasAdminRole =
      user.roles?.some((role) => role.name === 'admin') ?? false;

    if (!hasAdminRole) {
      throw new ForbiddenException('Admin privileges required');
    }

    return true;
  }
}
