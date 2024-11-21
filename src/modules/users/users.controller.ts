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
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { RolesGuard, UserRoles } from '#/shared/guards/roles.guard';
import { Roles } from '#/shared/constants/user-roles.constant';

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
  async getAllUsers() {
    const result = await this.userService.listUsers();

    return {
      statusCode: 200,
      message: 'Users successfully received',
      data: result,
    };
  }

  @Get('wishlist')
  @UseGuards(AccessTokenGuard)
  async getUserWishlist(@GetAccount('accountId') userId: string) {
    const result = await this.userService.getUserWishlist(userId);

    return {
      message: 'User wishlist successfully received',
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
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @UploadedFile() image: Express.Multer.File,
    @GetAccount('accountId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    let imageUrl: string | undefined;
    if (image) {
      imageUrl = await this.uploadService.uploadImage(image);
    }

    const result = await this.userService.updateProfile(
      userId,
      updateProfileDto,
      imageUrl,
    );

    return {
      message: 'Profile successfully updated',
      data: result,
    };
  }

  @Put('role')
  @UseGuards(RolesGuard)
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard)
  async toggleUserRole(@GetAccount('accountId') userId: string) {
    const result = await this.userService.toggleUserRole(userId);

    return {
      message: 'User role successfully updated',
      data: result,
    };
  }

  @Delete('profile')
  @UseGuards(AccessTokenGuard)
  async deleteAccount(@GetAccount('accountId') userId: string) {
    const result = await this.userService.deleteAccount(userId);

    return {
      message: 'Profile successfully deleted',
      data: result,
    };
  }
}
