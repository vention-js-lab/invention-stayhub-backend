import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { Account } from '../user/entities/account.entity';
import { Profile } from '../user/entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountRefreshToken } from './entities/account-refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Account, Profile, AccountRefreshToken]),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  imports: [JwtModule, PassportModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
