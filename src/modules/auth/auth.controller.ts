import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google')
  @UseGuards(AuthGuard('google')) // Use Google OAuth2 strategy guard
  @ApiOperation({
    summary: 'Google Authentication',
    description: 'Redirects to Google for OAuth2 login',
  })
  @ApiResponse({ status: 302, description: 'Redirects to Google login' })
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google Authentication Callback',
    description: 'Callback for Google OAuth2 login',
  })
  @ApiResponse({
    status: 200,
    description: 'User info from Google',
    schema: {
      example: {
        message: 'User info From Google',
        user: {
          email: 'example@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          picture: 'https://example.com/photo.jpg',
          googleId: '1234567890',
        },
      },
    },
  })
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
