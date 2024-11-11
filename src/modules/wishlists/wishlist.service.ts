import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(accountId: string, accommodationId: string): Promise<Wishlist> {
    const wishlistItem = this.wishlistRepository.create({
      accountId: accountId,
      accommodationId: accommodationId,
    });
    return await this.wishlistRepository.save(wishlistItem);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find();
  }

  async findOne(id: string): Promise<Wishlist> {
    const wishlistItem = await this.wishlistRepository.findOneBy({ id });
    if (!wishlistItem) {
      throw new NotFoundException(`Wishlist item with ID ${id} not found`);
    }
    return wishlistItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.wishlistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist item with ID ${id} not found`);
    }
  }
}
