import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { StripeService } from './services/stripe.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './services/payments.service';
import { BookingsModule } from '../bookings/bookings.module';
import { AccommodationsModule } from '../accommodations/accommodations.module';
import { StripeApiService } from './services/stripe-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking]), BookingsModule, AccommodationsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeApiService, StripeService],
})
export class PaymentsModule {}
