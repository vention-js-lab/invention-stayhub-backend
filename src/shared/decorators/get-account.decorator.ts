import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { extractRequestAccount } from '#/shared/extractors/request-account.extractor';
import { type RequestAccount } from '#/modules/auth/types/request-account.type';
import { type Request } from 'express';

export const GetAccount = createParamDecorator((data: keyof RequestAccount | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const account = extractRequestAccount(request);

  if (!account) {
    throw new UnauthorizedException();
  }

  if (!data) {
    return account;
  }

  if (!account[data]) {
    throw new UnauthorizedException();
  }

  return account[data];
});
