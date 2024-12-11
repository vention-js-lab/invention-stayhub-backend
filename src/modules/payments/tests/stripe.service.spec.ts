import { Test, type TestingModule } from '@nestjs/testing';
import { StripeService } from '../services/stripe.service';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { PaymentsService } from '../services/payments.service';
import { StripeApiService } from '../services/stripe-api.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { BookingStatus } from '#/shared/constants/booking-status.constant';

describe('StripeService', () => {
  let stripeService: StripeService;
  let bookingsService: BookingsService;
  let paymentsService: PaymentsService;
  let stripeApiService: StripeApiService;

  const mockPaymentIntent = {
    amount: 10000,
    id: 'pi_mockId',
    metadata: { bookingId: 'mockBookingId' },
  };

  const mockEvent = {
    type: 'payment_intent.succeeded',
    data: { object: mockPaymentIntent },
  };

  const mockWebhookSecret = 'mock_webhook_secret';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: BookingsService,
          useValue: {
            updateStatus: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: PaymentsService,
          useValue: {
            savePayment: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: StripeApiService,
          useValue: {
            stripe: {
              paymentIntents: {
                create: jest.fn().mockResolvedValue({ client_secret: 'mock_client_secret' }),
              },
              webhooks: {
                constructEvent: jest.fn().mockReturnValue(mockEvent),
              },
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockWebhookSecret),
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
      const mockMetadata = { bookingId: 'mockBookingId', accountId: 'mockAccountId' };

      const clientSecret = await stripeService.createPaymentIntent(10000, mockMetadata);

      expect(clientSecret).toBe('mock_client_secret');
      expect(stripeApiService.stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: mockMetadata,
      });
    });
  });

  describe('handleWebhook', () => {
    it('throws BadRequestException if no signature is provided', async () => {
      await expect(stripeService.handleWebhook(Buffer.from(''), '')).rejects.toThrow(
        new BadRequestException('No webhook signature header was provided'),
      );
    });

    it('throws BadRequestException if webhook signature verification fails', async () => {
      stripeApiService.stripe.webhooks.constructEvent = jest.fn().mockImplementation(() => {
        throw new Error('Verification failed');
      });

      await expect(stripeService.handleWebhook(Buffer.from('mock_body'), 'mock_signature')).rejects.toThrow(
        new BadRequestException('Webhook signature verification failed'),
      );
    });

    it('saves payment and updates booking status on successful payment', async () => {
      const rawBody = Buffer.from('mock_body');
      const signature = 'mock_signature';

      await stripeService.handleWebhook(rawBody, signature);

      expect(stripeApiService.stripe.webhooks.constructEvent).toHaveBeenCalledWith(rawBody, signature, mockWebhookSecret);

      expect(paymentsService.savePayment).toHaveBeenCalledWith({
        amount: 10000,
        status: PaymentStatus.Success,
        transactionId: 'pi_mockId',
        bookingId: 'mockBookingId',
      });

      expect(bookingsService.updateStatus).toHaveBeenCalledWith('mockBookingId', { newStatus: BookingStatus.Upcoming });
    });
  });
});
