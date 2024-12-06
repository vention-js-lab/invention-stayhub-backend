import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { AccommodationsService } from '#/modules/accommodations/services/accommodations.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly accommodationsService: AccommodationsService,
  ) {}

  async addToWishlist(accountId: string, accommodationId: string) {
    await this.accommodationsService.getAccommodationById(accommodationId);

    const existingWishlistItem = await this.wishlistRepository.findOne({
      where: { accountId, accommodationId },
    });
    if (existingWishlistItem) {
      return existingWishlistItem;
    }

    const wishlistItem = this.wishlistRepository.create({
      accountId,
      accommodationId,
    });

    const savedWish = await this.wishlistRepository.save(wishlistItem);
    return savedWish;
  }

  async getUserWishlist(accountId: string) {
    const userWishlist = await this.wishlistRepository.find({
      where: { accountId },
      relations: ['accommodation', 'accommodation.address'],
    });

    return userWishlist;
  }

  async removeFromWishlist(accountId: string, accommodationId: string) {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { accountId, accommodationId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Accommodation not found');
    }

    await this.wishlistRepository.remove(wishlistItem);
  }
}
