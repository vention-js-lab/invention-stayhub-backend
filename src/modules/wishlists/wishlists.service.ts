import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const existingWishlistItem = await this.wishlistRepository.findOne({
      where: { accountId, accommodationId },
    });
    if (existingWishlistItem) {
      throw new ConflictException('Wishlist item already exists');
    }
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });
    if (!accommodation) {
      throw new NotFoundException('Accomodation not found');
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
    });

    return userWishlist;
  }

  async removeFromWishlist(wishId: string) {
    const result = await this.wishlistRepository.delete(wishId);
    if (result.affected === 0) {
      throw new NotFoundException(`Wished item not found`);
    }
  }
}
