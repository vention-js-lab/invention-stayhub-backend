import { Test, type TestingModule } from '@nestjs/testing';
import { StripeService } from '../services/stripe.service';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { PaymentsService } from '../services/payments.service';
import { StripeApiService } from '../services/stripe-api.service';
import { EmailService } from '#/modules/emails/email.service';
import { UsersService } from '#/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import type Stripe from 'stripe';

jest.mock('../constants/payment-intent-events-map.constant', () => {
  return {
    PaymentIntentEventsMap: new Map([['payment_intent.succeeded', 'success']]),
  };
});

describe('StripeService', () => {
  let stripeService: StripeService;
  let bookingsService: BookingsService;
  let paymentsService: PaymentsService;
  let stripeApiService: StripeApiService;

  const mockPaymentIntent: Partial<Stripe.PaymentIntent> = {
    id: 'pi_mockId',
    object: 'payment_intent',
    amount: 1680,
    currency: 'usd',
    metadata: { bookingId: 'mockBookingId', accountId: 'mockAccountId' },
    status: 'succeeded',
    client_secret: 'mock_client_secret',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
  };

  const mockEvent: Stripe.Event = {
    id: 'evt_mockId',
    object: 'event',
    type: 'payment_intent.succeeded',
    api_version: '2023-06-01',
    created: Math.floor(Date.now() / 1000),
    data: { object: mockPaymentIntent as Stripe.PaymentIntent },
    livemode: false,
    pending_webhooks: 1,
    request: { id: 'req_mockId', idempotency_key: 'idempotency_key_mock' },
  };

  const mockWebhookSecret = 'mock_webhook_secret';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: BookingsService,
          useValue: {
            updateStatus: jest.fn().mockResolvedValue(undefined),
            getBookingById: jest.fn().mockResolvedValue({
              startDate: '2025-06-19',
              endDate: '2025-06-20',
              accommodation: { name: 'Test Accommodation' },
            }),
          },
        },
        {
          provide: PaymentsService,
          useValue: {
            savePayment: jest.fn().mockResolvedValue(undefined),
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
                constructEvent: jest.fn(),
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
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserEmailAndFirstNameByAccountId: jest.fn().mockResolvedValue({
              email: 'user@example.com',
              firstName: 'John',
            }),
          },
        },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
    bookingsService = module.get<BookingsService>(BookingsService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    stripeApiService = module.get<StripeApiService>(StripeApiService);
  });

  describe('handleWebhook', () => {
    it('should throw BadRequestException if webhook signature verification fails', async () => {
      jest.spyOn(stripeApiService.stripe.webhooks, 'constructEvent').mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(stripeService.handleWebhook(Buffer.from('mock_body'), 'mock_signature')).rejects.toThrow(
        new BadRequestException('Webhook signature verification failed'),
      );
    });

    it('should process payment and update booking status', async () => {
      jest.spyOn(stripeApiService.stripe.webhooks, 'constructEvent').mockReturnValue(mockEvent);

      const rawBody = Buffer.from('mock_body');
      const signature = 'mock_signature';

      await stripeService.handleWebhook(rawBody, signature);

      expect(paymentsService.savePayment).toHaveBeenCalledWith({
        amount: 1680,
        status: 'success',
        transactionId: 'pi_mockId',
        bookingId: 'mockBookingId',
      });

      expect(bookingsService.updateStatus).toHaveBeenCalledWith('mockBookingId', {
        newStatus: 'upcoming',
      });

      expect(bookingsService.getBookingById).toHaveBeenCalledWith('mockBookingId', 'mockAccountId');
    });
  });
});
