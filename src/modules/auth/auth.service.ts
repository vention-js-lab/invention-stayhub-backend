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
import { GoogleUser } from './types/google-user-type';
import { Profile } from '../user/entities/profile.entity';
import { AccountType } from '../../shared/constants/user-account.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
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
      ...rest,
    });
    await this.accountRepository.save(user);

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
    const user = await this.accountRepository.findOne({
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

      newProfile.accountId = newAccount;

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
}
