import { type Roles } from '#/shared/constants/user-roles.constant';

export interface AuthTokenPayload {
  sub: string;
  userEmail: string;
  userRole: Roles;
}

export interface RefreshTokenPayload extends AuthTokenPayload {
  exp: number;
  iat: number;
}
