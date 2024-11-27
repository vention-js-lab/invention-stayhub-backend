import {
  RawBodyRequest,
  ExecutionContext,
  BadRequestException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { extractRequestRawBody } from '../extractors/raw-body.extractor';

export const RawBody = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RawBodyRequest<Request>>();
    const rawBody = extractRequestRawBody(request);

    if (!rawBody) {
      throw new BadRequestException();
    }

    return rawBody;
  },
);
