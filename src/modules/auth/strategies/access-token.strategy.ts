import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from '#/shared/configs/env.config';
import { AuthTokenPayload } from '../types/auth-payload.type';
import { JwtAuthConfig } from '#/shared/configs/jwt-auth.config';
import { Account } from '#/modules/user/entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  JwtAuthConfig.AccessTokenKey,
) {
  constructor(
    private configService: ConfigService<EnvConfig, true>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET', {
        infer: true,
      }),
    });
  }

  public async validate({ sub, userEmail, userRole }: AuthTokenPayload) {
    const existingAccount = await this.accountRepository.findOneBy({ id: sub });

    if (!existingAccount || existingAccount.isDeleted) {
      throw new UnauthorizedException('Account was deleted or is inactive');
    }

    return {
      accountId: sub,
      accountEmail: userEmail,
      accountRole: userRole,
    };
  }
}
