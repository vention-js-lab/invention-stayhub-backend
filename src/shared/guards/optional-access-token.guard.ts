import { Injectable } from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class OptionalAccessTokenGuard extends AccessTokenGuard {
  handleRequest<RequestAccount>(error, user: RequestAccount | boolean) {
    if (error || !user) {
      return undefined;
    }
    return user;
  }
}
