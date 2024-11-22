import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../users/entities/account.entity';
import { Repository } from 'typeorm';
import { Hasher } from '#/shared/libs/hasher.lib';
import { AuthTokenPayload } from './types/auth-payload.type';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { GoogleUser } from './types/google-user.type';
import { Profile } from '../users/entities/profile.entity';
import { AccountType } from '../../shared/constants/user-account.constant';
import { AccountRefreshToken } from './entities/account-refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(AccountRefreshToken)
    private refreshTokenRepository: Repository<AccountRefreshToken>,
    private configService: ConfigService<EnvConfig, true>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...rest } = registerDto;

    const existingUser = await this.accountRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await Hasher.hashValue(password);
    const user = this.accountRepository.create({
      email,
      password: hashedPassword,
    });
    await this.accountRepository.save(user);

    const userProfile = this.profileRepository.create({
      accountId: user.id,
      ...rest,
    });

    await this.profileRepository.save(userProfile);

    const { ...result } = user;
    delete result.password;

    const payload = {
      sub: user.id,
      userEmail: user.email,
      userRole: user.role,
    };

    const accessToken = await this.generateAuthToken(payload, 'access');
    const refreshToken = await this.generateAuthToken(payload, 'refresh');

    const refreshTokenEntity = this.createRefreshTokenEntity(refreshToken);
    await this.refreshTokenRepository.insert(refreshTokenEntity);

    const data = {
      result: result,
      accessToken,
      refreshToken,
    };

    return data;
  }

  async login({ email, password }: LoginDto) {
    const user = await this.accountRepository.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await Hasher.verifyHash(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      userEmail: user.email,
      userRole: user.role,
    };
    const accessToken = await this.generateAuthToken(payload, 'access');
    const refreshToken = await this.generateAuthToken(payload, 'refresh');

    const refreshTokenEntity = this.createRefreshTokenEntity(refreshToken);
    await this.refreshTokenRepository.insert(refreshTokenEntity);

    return {
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
    };
  }

  async issueNewTokens(refreshToken: string, sub: string) {
    const existingRefreshTokenEntity =
      await this.refreshTokenRepository.findOne({
        where: {
          accountId: sub,
          token: refreshToken,
          isDeleted: false,
        },
        relations: {
          account: true,
        },
      });

    if (
      !existingRefreshTokenEntity ||
      existingRefreshTokenEntity.account.isDeleted
    ) {
      throw new UnauthorizedException();
    }

    const { account } = existingRefreshTokenEntity;
    const payload = {
      sub: account.id,
      userEmail: account.email,
      userRole: account.role,
    };
    const newAccessToken = await this.generateAuthToken(payload, 'access');
    const newRefreshToken = await this.generateAuthToken(payload, 'refresh');

    const newRefreshTokenEntity =
      this.createRefreshTokenEntity(newRefreshToken);
    await this.refreshTokenRepository.remove(existingRefreshTokenEntity);
    await this.refreshTokenRepository.insert(newRefreshTokenEntity);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async generateAuthToken(
    payload: AuthTokenPayload,
    type: 'access' | 'refresh',
  ) {
    const secret =
      type === 'access'
        ? this.configService.get('JWT_ACCESS_TOKEN_SECRET', {
            infer: true,
          })
        : this.configService.get('JWT_REFRESH_TOKEN_SECRET', {
            infer: true,
          });

    const expiresIn =
      type === 'access'
        ? this.configService.get('JWT_ACCESS_TOKEN_EXPIRY', {
            infer: true,
          })
        : this.configService.get('JWT_REFRESH_TOKEN_EXPIRY', {
            infer: true,
          });

    const authToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
    return authToken;
  }

  async googleLogin(user: GoogleUser) {
    const { googleId, email, firstName, lastName, picture } = user;

    const existingUser = await this.findByGoogleId(googleId);

    if (!existingUser) {
      const newAccount = this.accountRepository.create({
        googleId,
        email,
        type: AccountType.Google,
      });
      const newProfile = this.profileRepository.create({
        firstName,
        lastName,
        image: picture,
      });
      await this.accountRepository.save(newAccount);

      newProfile.accountId = newAccount.id;

      await this.profileRepository.save(newProfile);
    }
    return {
      message: 'User info From Google',
      user,
    };
  }

  async findByGoogleId(id: string) {
    const user = await this.accountRepository.findOneBy({ googleId: id });
    return user;
  }

  private createRefreshTokenEntity(refreshToken: string) {
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decodedRefreshToken.exp * 1000).valueOf();

    const refreshTokenEntity = this.refreshTokenRepository.create({
      accountId: decodedRefreshToken.sub,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return refreshTokenEntity;
  }
}
