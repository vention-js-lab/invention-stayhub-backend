import { AccommodationModule } from '#/modules/accommodations/accommodations.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistService } from './wishlists.service';
import { WishlistController } from './wishlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), AccommodationModule],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistsModule {}
