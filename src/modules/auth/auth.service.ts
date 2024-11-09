import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../user/entities/account.entity';
import { Repository } from 'typeorm';
import { Hasher } from '#/shared/libs/hasher.lib';
import { AuthTokenPayload } from './types/auth-payload.type';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AccountRefreshToken } from './entities/refresh-tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AccountRefreshToken)
    private refreshTokenRepository: Repository<AccountRefreshToken>,
    private configService: ConfigService<EnvConfig, true>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...rest } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await Hasher.hashValue(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });
    await this.userRepository.save(user);

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
    const user = await this.userRepository.findOne({
      where: { email },
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

  async issueNewTokens(refreshToken: string) {
    const decodedRefreshToken =
      this.jwtService.decode<AuthTokenPayload>(refreshToken);

    const existingRefreshTokenEntity =
      await this.refreshTokenRepository.findOne({
        where: { userId: decodedRefreshToken.sub, token: refreshToken },
        relations: {
          user: true,
        },
      });

    if (!existingRefreshTokenEntity) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { user } = existingRefreshTokenEntity;
    const payload = {
      sub: user.id,
      userEmail: user.email,
      userRole: user.role,
    };
    const newAccessToken = await this.generateAuthToken(payload, 'access');
    const newRefreshToken = await this.generateAuthToken(payload, 'refresh');

    const newRefreshTokenEntity =
      this.createRefreshTokenEntity(newRefreshToken);

    existingRefreshTokenEntity.token = newRefreshToken;
    existingRefreshTokenEntity.expiresAt = newRefreshTokenEntity.expiresAt;
    await this.refreshTokenRepository.save(existingRefreshTokenEntity);

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

  private createRefreshTokenEntity(refreshToken: string) {
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decodedRefreshToken.exp * 1000).valueOf();

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: decodedRefreshToken.sub,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return refreshTokenEntity;
  }
}
