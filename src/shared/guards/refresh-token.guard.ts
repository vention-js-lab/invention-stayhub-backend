import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { JwtAuthConfig } from '../configs/jwt-auth.config';

export class RefreshTokenGuard extends PAuthGuard(JwtAuthConfig.RefreshTokenKey) {}
