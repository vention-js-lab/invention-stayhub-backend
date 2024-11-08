import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Hasher } from '#/shared/libs/hasher.lib';
import { AuthTokenPayload } from './types/auth-payload.type';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    const authToken = await this.generateAuthToken({
      sub: user.id,
      userEmail: user.email,
      userRole: user.role,
    });
    const data = {
      result: result,
      token: authToken,
    };

    return data;
  }
  async generateAuthToken(payload: AuthTokenPayload) {
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET', {
      infer: true,
    });
    const expiresIn = this.configService.get('JWT_ACCESS_TOKEN_EXPIRY', {
      infer: true,
    });

    const authToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
    return authToken;
  }
}
