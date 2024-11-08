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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private userRepository: Repository<Account>,
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

    return {
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
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

    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    return accessToken;
  }

  private async generateRefreshToken(payload: RefreshTokenPayload) {
    const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET', {
      infer: true,
    });
    const expiresIn = this.configService.get('JWT_REFRESH_TOKEN_EXPIRY', {
      infer: true,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    return refreshToken;
  }

  private createeRefreshTokenEntity(refreshToken: string) {
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decodedRefreshToken.exp * 1000);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: decodedRefreshToken.sub,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return refreshTokenEntity;
  }
}
