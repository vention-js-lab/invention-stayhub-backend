import { Roles } from '#/shared/constants/user-roles.constants';

export interface AuthTokenPayload {
  sub: string;
  userEmail: string;
  userRole: Roles;
}
