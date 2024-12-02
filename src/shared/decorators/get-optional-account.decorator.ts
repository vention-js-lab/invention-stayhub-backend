import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestAccount } from '#/modules/auth/types/request-account.type';
import { extractRequestAccount } from '../extractors/request-account.extractor';

export const GetOptionalAccount = createParamDecorator(
  (data: keyof RequestAccount | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
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
  },
);
