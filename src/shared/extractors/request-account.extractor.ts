import { type RequestAccount } from '#/modules/auth/types/request-account.type';
import { type Request } from 'express';

export function extractRequestAccount(request: Request) {
  if (!request.user) {
    return null;
  }

  return request.user as RequestAccount;
}
