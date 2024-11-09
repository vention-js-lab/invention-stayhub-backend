import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from '#/shared/configs/env.config';
import { AuthTokenPayload } from '../types/auth-payload.type';
import { JwtAuthConfig } from '#/shared/configs/jwt-auth.config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  JwtAuthConfig.AccessTokenKey,
) {
  constructor(private configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET', {
        infer: true,
      }),
    });
  }

  public async validate({ sub, userEmail, userRole }: AuthTokenPayload) {
    return {
      userId: sub,
      userEmail,
      userRole: userRole,
    };
  }
}
