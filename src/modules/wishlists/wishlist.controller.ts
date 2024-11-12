import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { WishlistService } from '#/modules/wishlists/wishlist.service';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { GetAccount } from '../auth/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { RolesGuard, UserRoles } from '#/shared/guards/roles.guard';
import { Roles } from '../../shared/constants/user-roles.constants';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async create(
    @GetAccount('accountId') accountId: string,
    @Body(new ValidationPipe()) createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const accommodationId = createWishlistDto.accommodationId;
    return await this.wishlistService.create(accountId, accommodationId);
  }

  @Get('all')
  @UserRoles(Roles.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Wishlist> {
    const wishlistItem = await this.wishlistService.findOne(id);
    return wishlistItem;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.wishlistService.remove(id);
  }
}
