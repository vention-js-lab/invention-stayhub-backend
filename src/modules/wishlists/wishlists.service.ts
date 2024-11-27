import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
  ) {}

  async addToWishlist(accountId: string, accommodationId: string) {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });
    if (!accommodation) {
      throw new NotFoundException('Accomodation not found');
    }

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
    const userWishlist = await this.accommodationRepository
      .createQueryBuilder('accommodation')
      .leftJoinAndSelect('accommodation.wishlist', 'wishlist')
      .where('wishlist.accountId = :accountId', { accountId })
      .select([
        'accommodation.id',
        'accommodation.name',
        'accommodation.coverImage',
        'accommodation.price',
        'accommodation.available',
        'accommodation.availableFrom',
        'accommodation.availableTo',
        'accommodation.squareMeters',
        'accommodation.numberOfRooms',
      ])
      .getMany();

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
