import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from '#/shared/configs/env.config';
import { AuthTokenPayload } from '../types/auth-payload.type';
import { JwtAuthConfig } from '#/shared/configs/jwt-auth.config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRefreshToken } from '../entities/account-refresh-token.entity';
import { Request } from 'express';
import { extractRequestBody } from '#/shared/extractors/request-body.extractor';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, JwtAuthConfig.RefreshTokenKey) {
  constructor(
    private configService: ConfigService<EnvConfig, true>,
    @InjectRepository(AccountRefreshToken)
    private refreshTokenRepository: Repository<AccountRefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET', {
        infer: true,
      }),
      passReqToCallback: true,
    });
  }

  public async validate(request: Request, { sub }: AuthTokenPayload) {
    const { refreshToken } = extractRequestBody<RefreshTokenDto>(request);

    const existingRefreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: {
        accountId: sub,
        token: refreshToken,
        isDeleted: false,
      },
      relations: {
        account: true,
      },
    });

    if (!existingRefreshTokenEntity || existingRefreshTokenEntity.account.deletedAt) {
      throw new UnauthorizedException();
    }

    return {
      accountId: sub,
    };
  }
}
