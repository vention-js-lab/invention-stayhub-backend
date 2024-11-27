import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';
import { StripeConfig } from './types/stripe-config.type';
import { PaymentsService } from './services/payments.service';
import { BookingsModule } from '../bookings/bookings.module';
import { AccommodationModule } from '../accommodations/accommodations.module';
import Stripe from 'stripe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking]),
    BookingsModule,
    AccommodationModule,
  ],
  controllers: [StripeController],
  providers: [
    PaymentsService,
    {
      provide: 'STRIPE_CONFIG',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvConfig>) => {
        const apiKey = configService.get('STRIPE_PRIVATE_API_KEY', {
          infer: true,
        });
        const successUrl = configService.get('STRIPE_SUCCESS_URL', {
          infer: true,
        });
        const cancelUrl = configService.get('STRIPE_CANCEL_URL', {
          infer: true,
        });
        const webhookSecret = configService.get('STRIPE_WEBHOOK_SECRET', {
          infer: true,
        });
        return { apiKey, successUrl, cancelUrl, webhookSecret };
      },
    },
    {
      provide: 'STRIPE',
      inject: ['STRIPE_CONFIG'],
      useFactory: async (stripeConfig: StripeConfig) => {
        return new Stripe(stripeConfig.apiKey, {
          apiVersion: '2024-11-20.acacia',
        });
      },
    },
    StripeService,
  ],
})
export class PaymentsModule {}
