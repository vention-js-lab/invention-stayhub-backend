import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { Account } from '../users/entities/account.entity';
import { Profile } from '../users/entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountRefreshToken } from './entities/account-refresh-token.entity';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Account, Profile, AccountRefreshToken]),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
