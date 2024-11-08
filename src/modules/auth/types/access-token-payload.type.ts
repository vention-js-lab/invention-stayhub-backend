import { Roles } from '#/shared/constants/user-roles.constants';

export interface AccessTokenPayload {
  sub: string;
  userEmail: string;
  userRole: Roles;
}
