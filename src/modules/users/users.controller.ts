import { ListUsersResponseDto } from './dto/responses/list-users.res';
import { ProfileResDto } from './dto/responses/profile.res';
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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/requests/update-profile.req';
import { RolesGuard, UserRoles } from '#/shared/guards/roles.guard';
import { Roles } from '#/shared/constants/user-roles.constant';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { UserFiltersReqQueryDto } from './dto/requests/users-filters.req';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SnakeToCamelInterceptor } from '#/shared/interceptors/snake-to-camel.interceptor';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with filters' })
  @ApiQuery({
    name: 'filters',
    type: UserFiltersReqQueryDto,
    required: false,
    description: 'Query parameters for filtering users',
  })
  @ApiOkResponse({
    description: 'List of users fetched successfully',
    type: ListUsersResponseDto,
  })
  @UseInterceptors(SnakeToCamelInterceptor)
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async listUsers(@Query() filters: UserFiltersReqQueryDto) {
    const result = await this.userService.listUsers(filters);

    return withBaseResponse({
      status: 200,
      message: 'Users successfully received',
      data: result,
    });
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({
    description: 'User profile fetched successfully',
    type: ProfileResDto,
  })
  @UseGuards(AccessTokenGuard)
  async getProfile(@GetAccount('accountId') accountId: string) {
    const result = await this.userService.getProfile(accountId);

    return withBaseResponse({
      status: 200,
      message: 'Profile successfully received',
      data: result,
    });
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({
    description: 'User profile updated successfully',
    type: ProfileResDto,
  })
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
  @ApiOperation({ summary: 'Update the user profile avatar' })
  @ApiOkResponse({
    description: 'User profile avatar updated successfully',
    type: ProfileResDto,
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfileAvatar(
    @UploadedFile() avatarImg: Express.Multer.File,
    @GetAccount('accountId') accountId: string,
  ) {
    if (!avatarImg) {
      throw new BadRequestException('Image is required');
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
  @ApiOperation({ summary: 'Toggle user role (admin only)' })
  @ApiOkResponse({
    description: 'User role updated successfully',
    type: ProfileResDto,
  })
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

  @Delete(':userId')
  @ApiOperation({ summary: 'Soft delete a user account' })
  @ApiOkResponse({
    description: 'User soft deleted successfully',
  })
  @UseGuards(AccessTokenGuard)
  async deleteAccount(
    @GetAccount('accountId') deleteActorId: string,
    @Param('userId') deletingAccountId: string,
  ) {
    const result = await this.userService.softDeleteAccount(
      deleteActorId,
      deletingAccountId,
    );

    return withBaseResponse({
      status: 200,
      message: 'Account successfully deleted',
      data: result,
    });
  }
}
