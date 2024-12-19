import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/register.req';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.req';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { GoogleUser } from './types/google-user.type';
import { RefreshTokenDto } from './dto/request/refresh-token.req';
import { RefreshTokenGuard } from '#/shared/guards/refresh-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return withBaseResponse({
      status: 201,
      message: 'User registered successfully',
      data: result,
    });
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User log in' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return withBaseResponse({
      status: 200,
      message: 'User logged in successfully',
      data: result,
    });
  }

  @Post('google/redirect')
  @ApiOperation({
    summary: 'Google Authentication Callback',
    description: 'Callback for Google OAuth2 login',
  })
  @ApiResponse({
    status: 200,
    description: 'User info from Google',
  })
  async googleAuthRedirect(@Body() user: GoogleUser) {
    const result = await this.authService.googleLogin(user);
    return withBaseResponse({
      status: 200,
      message: 'User logged in successfully via Google',
      data: result,
    });
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get new access and refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'New tokens retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @UseGuards(RefreshTokenGuard)
  async issueNewTokens(@Body() refreshTokenDto: RefreshTokenDto, @GetAccount('accountId') accountId: string) {
    const newTokens = await this.authService.issueNewTokens(refreshTokenDto.refreshToken, accountId);

    return withBaseResponse({
      status: 200,
      message: 'New tokens retrieved successfully',
      data: newTokens,
    });
  }
}
