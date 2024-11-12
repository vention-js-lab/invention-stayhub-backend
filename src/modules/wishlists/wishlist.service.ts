import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { Account } from '../user/entities/account.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(accountId: string, accommodationId: string): Promise<Wishlist> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    const existingWishlistItem = await this.wishlistRepository.findOne({
      where: { accountId: accountId, accommodationId: accommodationId },
    });
    if (existingWishlistItem) {
      throw new ConflictException('Wishlist item already exists');
    }
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
    return wishlistItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.wishlistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist item with ID ${id} not found`);
    }
  }
}
