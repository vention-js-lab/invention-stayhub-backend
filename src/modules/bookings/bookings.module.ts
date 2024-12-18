import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Accommodation } from '../accommodations/entities/accommodation.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Accommodation]), UsersModule],
  exports: [BookingsService],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
