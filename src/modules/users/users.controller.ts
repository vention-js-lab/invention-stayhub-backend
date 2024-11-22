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
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
  async getProfile(@GetAccount('accountId') accountId: string) {
    const result = await this.userService.getProfile(accountId);

    return withBaseResponse({
      status: 200,
      message: 'Profile successfully received',
      data: result,
    });
  }

  @Get('wishlist')
  @UseGuards(AccessTokenGuard)
  async getUserWishlist(@GetAccount('accountId') accountId: string) {
    const result = await this.userService.getUserWishlist(accountId);

    return withBaseResponse({
      status: 200,
      message: 'User wishlist successfully received',
      data: result,
    });
  }

  @Put('profile')
  @UseGuards(AccessTokenGuard)
  async updateProfile(
    @GetAccount('accountId') accountId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result = await this.userService.updateProfile(
      accountId,
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
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfileAvatar(
    @UploadedFile() avatarImg: Express.Multer.File,
    @GetAccount('accountId') accountId: string,
  ) {
    if (!avatarImg) {
      throw new NotFoundException('Uploading file not found');
    }

    const avatarUrl = await this.uploadService.uploadImage(avatarImg);
    const result = await this.userService.updateProfileAvatar(
      accountId,
      avatarUrl,
    );

    return withBaseResponse({
      status: 200,
      message: 'Profile avatar successfully updated',
      data: result,
    });
  }

  @Put(':accountId/role')
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async toggleUserRole(@Param('accountId') accountId: string) {
    const result = await this.userService.toggleUserRole(accountId);

    return withBaseResponse({
      status: 200,
      message: 'User role successfully updated',
      data: result,
    });
  }

  @Delete(':accountId')
  @UseGuards(AccessTokenGuard)
  async deleteAccount(
    @GetAccount('accountId') deleterId: string,
    @Param('accountId') deletingAccountId: string,
  ) {
    const result = await this.userService.deleteAccount(
      deleterId,
      deletingAccountId,
    );

    return withBaseResponse({
      status: 200,
      message: 'Account successfully deleted',
      data: result,
    });
  }
}
