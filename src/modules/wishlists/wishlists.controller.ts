import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { WishlistsService } from '#/modules/wishlists/wishlists.service';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { CreateWishlistItemDto } from './dto/request/create-wishlist.req';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistResDto } from './dto/response/wishlist-item.res';
import { UUIDValidationPipe } from '#/shared/pipes/uuid-validation.pipe';

@ApiTags('wishlists')
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @ApiOperation({ summary: 'Adding accommodation to user wishlist' })
  @ApiOkResponse({
    description: 'Accommodation successfully added to user wishlist',
    type: WishlistResDto,
  })
  @UseGuards(AccessTokenGuard)
  async addToWishlist(@GetAccount('accountId') accountId: string, @Body() createWishlistItemDto: CreateWishlistItemDto) {
    const accommodationId = createWishlistItemDto.accommodationId;
    const result = await this.wishlistsService.addToWishlist(accountId, accommodationId);

    return withBaseResponse({
      status: 201,
      message: 'Accommodation successfully added to user wishlist',
      data: result,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Getting user wishlist' })
  @ApiOkResponse({
    description: 'User wishlist successfully received',
    type: WishlistResDto,
    isArray: true,
  })
  @UseGuards(AccessTokenGuard)
  async getUserWishlist(@GetAccount('accountId') accountId: string) {
    const result = await this.wishlistsService.getUserWishlist(accountId);

    return withBaseResponse({
      status: 200,
      message: 'User wishlist successfully received',
      data: result,
    });
  }

  @Delete(':accommodationId')
  @ApiOperation({ summary: 'Removing wishlist item' })
  @ApiOkResponse({
    description: 'Wishlist item successfully deleted',
  })
  @UseGuards(AccessTokenGuard)
  async removeFromWishlist(
    @GetAccount('accountId') accountId: string,
    @Param('accommodationId', new UUIDValidationPipe()) accommodationId: string,
  ) {
    await this.wishlistsService.removeFromWishlist(accountId, accommodationId);

    return withBaseResponse({
      status: 204,
      message: 'Wishlist item successfully deleted',
      data: null,
    });
  }
}
