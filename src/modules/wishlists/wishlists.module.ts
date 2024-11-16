import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Account } from '../users/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Account])],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistsModule {}
