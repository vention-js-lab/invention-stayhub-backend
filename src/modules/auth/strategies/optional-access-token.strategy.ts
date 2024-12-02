import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from '#/shared/configs/env.config';
import { AuthTokenPayload } from '../types/auth-payload.type';
import { JwtAuthConfig } from '#/shared/configs/jwt-auth.config';
import { Account } from '#/modules/users/entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestAccount } from '../types/request-account.type';

@Injectable()
export class OptionalAccessTokenStrategy extends PassportStrategy(Strategy, JwtAuthConfig.OptionalAccessTokenKey) {
  constructor(
    private configService: ConfigService<EnvConfig, true>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET', {
        infer: true,
      }),
    });
  }

  public async validate({ sub, userEmail, userRole }: AuthTokenPayload) {
    const existingAccount = await this.accountRepository.findOneBy({
      id: sub,
      deletedAt: undefined,
    });

    if (!existingAccount || existingAccount.role !== userRole) {
      return null;
    }

    const requestAccount: RequestAccount = {
      accountId: sub,
      accountEmail: userEmail,
      accountRole: userRole,
    };

    return requestAccount;
  }
}
