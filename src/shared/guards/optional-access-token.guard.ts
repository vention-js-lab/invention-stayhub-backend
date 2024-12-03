import { Injectable } from '@nestjs/common';
import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { JwtAuthConfig } from '../configs/jwt-auth.config';

@Injectable()
export class OptionalAccessTokenGuard extends PAuthGuard(JwtAuthConfig.OptionalAccessTokenKey) {
  handleRequest<RequestAccount>(error, user: RequestAccount | boolean) {
    if (error || !user) {
      return null;
    }

    return user;
  }
}
