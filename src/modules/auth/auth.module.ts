import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../user/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountRefreshToken } from './entities/account-refresh-token.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Account, AccountRefreshToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
