import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { UserService } from './user.service';
import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // This endpoint should checked by AdminGuard
  @Get()
  async getAllUsers() {
    const result = await this.userService.getAllUsers();

    return {
      message: 'Users successfully received',
      data: result,
    };
  }

  @Get('profile')
  // For now I use default uuid, because we haven't AuthGuard and JwtStrategy to take id from req.user.id
  async getProfile(userId: string = '2c683049-f9fc-44aa-98de-555422e6b25a') {
    const result = await this.userService.getProfile(userId);

    return {
      message: 'Profile successfully received',
      data: result,
    };
  }

  @Put('profile')
  // For now I use default uuid, because we haven't AuthGuard and JwtStrategy to take id from req.user.id
  async updateProfile(
    userId: string = '2c683049-f9fc-44aa-98de-555422e6b25a',
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result = await this.userService.updateProfile(
      userId,
      updateProfileDto,
    );

    return {
      message: 'Profile successfully updated',
      data: result,
    };
  }

  @Delete(':userId')
  // This endpoint should checked by AdminGuard
  // For now I use default uuid, because we haven't AuthGuard and JwtStrategy to take id from req.user.id
  async deleteUserById(
    @Param('userId') userId: string = '2c683049-f9fc-44aa-98de-555422e6b25a',
  ) {
    const result = await this.userService.deleteUserById(userId);

    return {
      message: 'User successfully deleted',
      data: result,
    };
  }
}
