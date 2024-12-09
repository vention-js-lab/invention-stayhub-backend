import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../constants/user-roles.constant';
import { extractRequestAccount } from '../extractors/request-account.extractor';
import { Request } from 'express';

const ROLES_DECORATOR_KEY = 'roles';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const allowedRoles = this.reflector.getAllAndOverride<Roles[] | undefined>(ROLES_DECORATOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const account = extractRequestAccount(request);
    const accountRole = account?.accountRole;

    if (!account) {
      throw new UnauthorizedException();
    }

    if (!accountRole) {
      throw new UnauthorizedException();
    }

    return allowedRoles.includes(account.accountRole);
  }
}

export const UserRoles = (...roles: Roles[]) => {
  return SetMetadata(ROLES_DECORATOR_KEY, roles);
};
