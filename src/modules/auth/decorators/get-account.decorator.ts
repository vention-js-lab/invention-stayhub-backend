import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestAccount } from '../types/request-account.type';
import { extractRequestAccount } from '#/shared/extractors/request-account.extractor';

export const GetAccount = createParamDecorator(
  (data: keyof RequestAccount | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const account = extractRequestAccount(request);

    if (!account) {
      throw new UnauthorizedException();
    }

    return data ? account[data] : account;
  },
);
