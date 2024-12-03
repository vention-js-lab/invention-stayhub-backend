import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { extractRequestAccount } from '../extractors/request-account.extractor';
import { type RequestAccount } from '#/modules/auth/types/request-account.type';
import { type Request } from 'express';

export const GetOptionalAccount = createParamDecorator((data: keyof RequestAccount | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const account = extractRequestAccount(request);

  if (!account) {
    return null;
  }

  if (!data) {
    return account;
  }

  if (!account[data]) {
    return null;
  }

  return account[data];
});
