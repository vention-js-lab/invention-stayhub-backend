import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { JwtAuthConfig } from '../configs/jwt-auth.config';

export class AccessTokenGuard extends PAuthGuard(
  JwtAuthConfig.AccessTokenKey,
) {}
