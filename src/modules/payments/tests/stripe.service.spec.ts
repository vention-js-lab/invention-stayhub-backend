import { Test, type TestingModule } from '@nestjs/testing';
import { StripeService } from '../services/stripe.service';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { PaymentsService } from '../services/payments.service';
import { StripeApiService } from '../services/stripe-api.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { type CheckoutReqDto } from '../dto/request/checkout.req';

describe('StripeService', () => {
  let stripeService: StripeService;
  let bookingsService: BookingsService;
  let paymentsService: PaymentsService;
  let stripeApiService: StripeApiService;

  const mockBooking = { id: '484c818e-edb0-48f5-98a5-021cc380b494', status: BookingStatus.Pending };

  const mockStripePaymentIntent = {
    client_secret: 'client_secret_484c818e-edb0-48f5-98a5-021cc380b494',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: BookingsService,
          useValue: {
            getBookingById: jest.fn().mockResolvedValue(mockBooking),
            updateStatus: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: PaymentsService,
          useValue: {
            getPaymentByBookingId: jest.fn().mockResolvedValue(null),
            savePayment: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: StripeApiService,
          useValue: {
            stripe: {
              paymentIntents: {
                create: jest.fn().mockResolvedValue(mockStripePaymentIntent),
              },
              webhooks: {
                constructEvent: jest.fn().mockReturnValue({ type: 'payment_intent.succeeded', data: { object: {} } }),
              },
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock_webhook_secret'),
          },
        },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
    bookingsService = module.get<BookingsService>(BookingsService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    stripeApiService = module.get<StripeApiService>(StripeApiService);
  });

  describe('createPaymentIntent', () => {
    it('creates a payment intent successfully', async () => {
      const checkoutReqDto: CheckoutReqDto = {
        bookingId: '484c818e-edb0-48f5-98a5-021cc380b494',
        amount: 10000,
      };

      const clientSecret = await stripeService.createPaymentIntent('484c818e-edb0-48f5-98a5-021cc380b494', checkoutReqDto);

      expect(clientSecret).toBe('client_secret_484c818e-edb0-48f5-98a5-021cc380b494');
      expect(stripeApiService.stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'usd',
        metadata: {
          bookingId: '484c818e-edb0-48f5-98a5-021cc380b494',
          accountId: '484c818e-edb0-48f5-98a5-021cc380b494',
        },
      });
    });

    it('throws BadRequestException if booking does not exist', async () => {
      bookingsService.getBookingById = jest.fn().mockResolvedValue(null);

      const checkoutReqDto: CheckoutReqDto = {
        bookingId: '484c818e-edb0-48f5-98a5-021cc380b494',
        amount: 1000,
      };

      await expect(
        stripeService.createPaymentIntent('484c818e-edb0-48f5-98a5-021cc380b494', checkoutReqDto),
      ).rejects.toThrowError(new BadRequestException('Booking does not exist'));
    });

    it('throws ConflictException if payment already exists', async () => {
      paymentsService.getPaymentByBookingId = jest.fn().mockResolvedValue({ status: PaymentStatus.Success });

      const checkoutReqDto: CheckoutReqDto = {
        bookingId: '484c818e-edb0-48f5-98a5-021cc380b494',
        amount: 1000,
      };

      await expect(
        stripeService.createPaymentIntent('484c818e-edb0-48f5-98a5-021cc380b494', checkoutReqDto),
      ).rejects.toThrowError(new ConflictException('This booking has already been paid for'));
    });
  });

  describe('handleWebhook', () => {
    it('throws BadRequestException if no signature is provided', async () => {
      await expect(stripeService.handleWebhook(Buffer.from(''), '')).rejects.toThrowError(
        new BadRequestException('No webhook signature header was provided'),
      );
    });

    it('throws BadRequestException if webhook signature verification fails', async () => {
      stripeApiService.stripe.webhooks.constructEvent = jest.fn().mockImplementation(() => {
        throw new Error('Verification failed');
      });

      await expect(stripeService.handleWebhook(Buffer.from(''), 'invalid_signature')).rejects.toThrowError(
        new BadRequestException('Webhook signature verification failed'),
      );
    });
  });
});
