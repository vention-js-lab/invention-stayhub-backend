import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { mapKeys, camelCase } from 'lodash';
import { Request } from 'express';

@Injectable()
export class SnakeToCamelInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest<Request>();
    const requestQuery = request.query as Request['query'] | undefined;

    if (requestQuery) {
      request.query = mapKeys(request.query, (_value: unknown, key: string) => {
        if (hasMultipleSeparators(key) || hasInvalidCharacters(key)) {
          return false;
        }

        return camelCase(key);
      });

      return next.handle();
    }

    return next.handle();
  }
}

function hasMultipleSeparators(key: string): boolean {
  return /[-_]{2,}/.test(key);
}

function hasInvalidCharacters(key: string): boolean {
  return /[^a-z0-9_-]/i.test(key);
}
