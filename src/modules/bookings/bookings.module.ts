import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { BookingsController } from './controllers/bookings.controller';
import { BookingsService } from './services/bookings.service';
import { Accommodation } from '../accommodations/entities/accommodations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Accommodation])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
