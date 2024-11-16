import { Roles } from '#/shared/constants/user-roles.constant';

export interface AuthTokenPayload {
  sub: string;
  userEmail: string;
  userRole: Roles;
}
