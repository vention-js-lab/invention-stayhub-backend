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
      request.query = mapKeys(request.query, (value, key) => {
        if (/[-_]{2,}|[^a-z0-9_-]/.test(key)) {
          //Ignoring query if it's not in required format
          return false;
        }
        return camelCase(key);
      });

      return next.handle();
    }
  }
}
