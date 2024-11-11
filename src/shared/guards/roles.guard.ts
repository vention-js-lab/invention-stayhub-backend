import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../constants/user-roles.constants';

const ROLES_DECORATOR_KEY = 'roles';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const allowedRoles = this.reflector.getAllAndOverride<Roles[]>(
      ROLES_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return allowedRoles.includes(user.role);
  }
}

export const UserRoles = (...roles: Roles[]) => {
  return SetMetadata(ROLES_DECORATOR_KEY, roles);
};
