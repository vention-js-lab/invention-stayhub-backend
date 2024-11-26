import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Booking } from '../bookings/entities/booking.entity';
import { Accommodation } from '../accommodations/entities/accommodations.entity';
import { Account } from '../users/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Booking, Accommodation, Account]),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
