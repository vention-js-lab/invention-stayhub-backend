import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { Account } from '../user/entities/account.entity';
import { Profile } from '../user/entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountRefreshToken } from './entities/account-refresh-token.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Account, Profile]),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Account, AccountRefreshToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
