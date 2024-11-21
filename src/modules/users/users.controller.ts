import { UploadService } from './../uploads/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/modules/auth/decorators/get-account.decorator';
import { UserService } from './users.service';
import {
  Controller,
  Get,
  Put,
  Delete,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { RolesGuard, UserRoles } from '#/shared/guards/roles.guard';
import { Roles } from '#/shared/constants/user-roles.constant';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard)
  async listUsers() {
    const result = await this.userService.listUsers();

    return withBaseResponse({
      status: 200,
      message: 'Users successfully received',
      data: result,
    });
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@GetAccount('accountId') userId: string) {
    const result = await this.userService.getProfile(userId);

    return withBaseResponse({
      status: 200,
      message: 'Profile successfully received',
      data: result,
    });
  }

  @Get('wishlist')
  @UseGuards(AccessTokenGuard)
  async getUserWishlist(@GetAccount('accountId') userId: string) {
    const result = await this.userService.getUserWishlist(userId);

    return withBaseResponse({
      status: 200,
      message: 'User wishlist successfully received',
      data: result,
    });
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

    return withBaseResponse({
      status: 200,
      message: 'Profile successfully updated',
      data: result,
    });
  }

  @Put('profile/avatar')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileAvatar(
    @UploadedFile() image: Express.Multer.File,
    @GetAccount('accountId') userId: string,
  ) {
    if (!image) {
      throw new NotFoundException('Uploading file not found');
    }

    const imgUrl = await this.uploadService.uploadImage(image);
    const result = await this.userService.updateProfileAvatar(userId, imgUrl);

    return withBaseResponse({
      status: 200,
      message: 'Profile avatar successfully updated',
      data: result,
    });
  }

  @Put(':userId/role')
  @UseGuards(RolesGuard)
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard)
  async toggleUserRole(@Param('userId') userId: string) {
    const result = await this.userService.toggleUserRole(userId);

    return withBaseResponse({
      status: 200,
      message: 'User role successfully updated',
      data: result,
    });
  }

  @Delete(':userId')
  @UseGuards(AccessTokenGuard)
  async deleteAccount(
    @GetAccount('accountId') deleterId: string,
    @Param('userId') deletingUserId: string,
  ) {
    const result = await this.userService.deleteAccount(
      deleterId,
      deletingUserId,
    );

    return withBaseResponse({
      status: 200,
      message: 'Account successfully deleted',
      data: result,
    });
  }
}
