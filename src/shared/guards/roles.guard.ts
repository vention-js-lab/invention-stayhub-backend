import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../constants/user-roles.constant';
import { extractRequestAccount } from '../extractors/request-account.extractor';

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
    const account = extractRequestAccount(request);

    if (!account) {
      throw new UnauthorizedException();
    }

    if (!account.accountRole) {
      throw new UnauthorizedException();
    }

    return allowedRoles.includes(account.accountRole);
  }
}

export const UserRoles = (...roles: Roles[]) => {
  return SetMetadata(ROLES_DECORATOR_KEY, roles);
};
