import { RequestAccount } from '#/modules/auth/types/request-account.type';
import { Request } from 'express';

export function extractRequestAccount(request: Request) {
  return request.user as RequestAccount;
}
