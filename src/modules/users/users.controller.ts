import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/modules/auth/decorators/get-account.decorator';
import { UserService } from './users.service';
import { Controller, Get, Put, Delete, UseGuards, Body } from '@nestjs/common';
import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { RolesGuard, UserRoles } from '#/shared/guards/roles.guard';
import { Roles } from '#/shared/constants/user-roles.constant';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard)
  async getAllUsers() {
    const result = await this.userService.listUsers();

    return {
      statusCode: 200,
      message: 'Users successfully received',
      data: result,
    };
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@GetAccount('accountId') userId: string) {
    const result = await this.userService.getProfile(userId);

    return {
      message: 'Profile successfully received',
      data: result,
    };
  }

  @Put('profile')
  @UseGuards(AccessTokenGuard)
  async updateProfile(
    @GetAccount('accountId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result = await this.userService.updateProfile(
      userId,
      updateProfileDto,
    );

    return {
      message: 'Profile successfully received',
      data: result,
    };
  }

  @Delete('account')
  @UseGuards(AccessTokenGuard)
  async deleteAccount(@GetAccount('accountId') userId: string) {
    const result = await this.userService.deleteAccountByOwner(userId);

    return {
      message: 'Profile successfully received',
      data: result,
    };
  }
}
