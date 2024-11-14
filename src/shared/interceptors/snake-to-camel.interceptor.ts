import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mapKeys, camelCase } from 'lodash';

@Injectable()
export class SnakeToCamelInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = ctx.switchToHttp().getRequest();

    if (request.query) {
      request.query = mapKeys(request.query, (value: any, key: string) => {
        if (hasMultipleSeparators(key) || hasInvalidCharacters(key)) {
          return false;
        }
        return camelCase(key);
      });

      return next.handle();
    }
  }
}

function hasMultipleSeparators(key: string): boolean {
  return /[-_]{2,}/.test(key);
}

function hasInvalidCharacters(key: string): boolean {
  return /[^a-z0-9_-]/i.test(key);
}
