import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { GoogleUser } from './types/google-user.type';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenGuard } from '#/shared/guards/refresh-token.guard';
import { AccountId } from '#/shared/extractors/account-id.extractor';

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
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User log in' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google Authentication Callback',
    description: 'Callback for Google OAuth2 login',
  })
  @ApiResponse({
    status: 200,
    description: 'User info from Google',
  })
  async googleAuthRedirect(@GetUser() user: GoogleUser) {
    return this.authService.googleLogin(user);
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
  async issueNewTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @AccountId() accountId: string,
  ) {
    const newTokens = await this.authService.issueNewTokens(
      refreshTokenDto.refreshToken,
      accountId,
    );

    return {
      message: 'New tokens retrieved successfully',
      data: newTokens,
    };
  }
}
