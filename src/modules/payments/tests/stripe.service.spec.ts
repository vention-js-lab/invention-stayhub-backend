import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from '#/modules/bookings/services/bookings.service';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { StripeService } from '../services/stripe.service';
import { PaymentsService } from '../services/payments.service';
import Stripe from 'stripe';

describe('StripeService', () => {
  let service: StripeService;
  let mockBookingsService: Partial<BookingsService>;
  let mockPaymentsService: Partial<PaymentsService>;
  let mockAccommodationService: Partial<AccommodationService>;
  let mockStripe: Partial<Stripe>;
  let mockPaymentRepository: any;

  beforeEach(async () => {
    mockBookingsService = {
      getBookingById: jest.fn(),
      updateBookingStatus: jest.fn(),
    };

    mockPaymentsService = {
      createPaymentRecord: jest.fn(),
    };

    mockAccommodationService = {
      updateAccommodationStatus: jest.fn(),
    };

    mockStripe = {
      checkout: {
        sessions: {
          create: jest.fn(),
          retrieve: jest.fn(),
          update: jest.fn(),
          list: jest.fn(),
          expire: jest.fn(),
          listLineItems: jest.fn(),
        },
      },
      webhooks: {
        constructEvent: jest.fn(),
        constructEventAsync: jest.fn(),
        generateTestHeaderString: jest.fn(),
        generateTestHeaderStringAsync: jest.fn(),
        signature: {
          EXPECTED_SCHEME: 'v1',
          verifyHeader: jest.fn(),
          verifyHeaderAsync: jest.fn(),
          parseHeader: jest.fn(),
        },
      },
    };

    mockPaymentRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
        {
          provide: AccommodationService,
          useValue: mockAccommodationService,
        },
        {
          provide: 'STRIPE',
          useValue: mockStripe,
        },
        {
          provide: 'STRIPE_CONFIG',
          useValue: {
            successUrl: 'success-url',
            cancelUrl: 'cancel-url',
            webhookSecret: 'webhook-secret',
          },
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  describe('createCheckoutSession', () => {
    it('throws BadRequestException if booking does not exist', async () => {
      (mockBookingsService.getBookingById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createCheckoutSession('accountId', {
          bookingId: 'nonexistent-booking',
          items: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws ConflictException if booking already paid', async () => {
      (mockBookingsService.getBookingById as jest.Mock).mockResolvedValue({
        accommodationId: 'accommodation-id',
      });
      (mockPaymentRepository.findOneBy as jest.Mock).mockResolvedValue({
        status: PaymentStatus.Success,
      });

      await expect(
        service.createCheckoutSession('accountId', {
          bookingId: 'existing-booking',
          items: [],
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('handleWebhook', () => {
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'payment-intent-id',
          amount: 1000,
          metadata: {
            bookingId: 'booking-id',
            accommodationId: 'accommodation-id',
          },
        },
      },
    };

    it('handles successful payment webhook', async () => {
      (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
        mockEvent,
      );

      await service.handleWebhook(Buffer.from(''), 'signature');

      expect(mockPaymentsService.createPaymentRecord).toHaveBeenCalledWith({
        amount: 1000,
        status: PaymentStatus.Success,
        transactionId: 'payment-intent-id',
        bookingId: 'booking-id',
      });

      expect(mockBookingsService.updateBookingStatus).toHaveBeenCalledWith({
        bookingId: 'booking-id',
        newStatus: BookingStatus.Upcoming,
      });

      expect(
        mockAccommodationService.updateAccommodationStatus,
      ).toHaveBeenCalledWith({
        accommodationId: 'accommodation-id',
        newStatus: false,
      });
    });
  });
});
