import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { WishlistService } from '#/modules/wishlists/wishlist.service';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { GetAccount } from '../auth/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { RolesGuard, UserRoles } from '#/shared/guards/roles.guard';
import { Roles } from '../../shared/constants/user-roles.constants';

@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async create(
    @GetAccount('accountId') accountId: string,
    @Body('accommodationId') accommodationId: string,
  ): Promise<Wishlist> {
    return await this.wishlistService.create(accountId, accommodationId);
  }

  @Get()
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findOne(@Param('id') id: string): Promise<Wishlist> {
    const wishlistItem = await this.wishlistService.findOne(id);
    if (!wishlistItem) {
      throw new NotFoundException(`Wishlist item with ID ${id} not found`);
    }
    return wishlistItem;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  async remove(@Param('id') id: string): Promise<void> {
    await this.wishlistService.remove(id);
  }
}
