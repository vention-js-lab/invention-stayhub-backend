import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Booking } from '../bookings/entities/booking.entity';
import { Accommodation } from '../accommodations/entities/accommodation.entity';
import { Account } from '../users/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Booking, Accommodation, Account])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
