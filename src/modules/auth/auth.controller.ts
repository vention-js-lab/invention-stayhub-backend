import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

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
  @Post('refresh-token')
  async refreshTokens(@Body() requestBody: RefreshTokenDto) {
    const newTokens = await this.authService.issueNewTokens(
      requestBody.refreshToken,
    );

    return newTokens;
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
}
