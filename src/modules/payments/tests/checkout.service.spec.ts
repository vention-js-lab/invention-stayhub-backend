import { Test, type TestingModule } from '@nestjs/testing';
import { CheckoutService } from '../services/checkout.service';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { PaymentsService } from '../services/payments.service';
import { StripeService } from '../services/stripe.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { getPriceDetails } from '../utils/checkout.util';

jest.mock('../utils/checkout.util');

describe('CheckoutService', () => {
  let checkoutService: CheckoutService;
  let bookingsService: BookingsService;
  let paymentsService: PaymentsService;
  let stripeService: StripeService;

  const mockBooking = { id: 'booking_id', price: 100, available: true };
  const mockPayment = { id: 'payment_id', status: PaymentStatus.Pending };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: BookingsService,
          useValue: {
            getBookingById: jest.fn().mockResolvedValue(mockBooking),
          },
        },
        {
          provide: PaymentsService,
          useValue: {
            getPaymentByBookingId: jest.fn().mockResolvedValue(mockPayment),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn().mockResolvedValue('mock_client_secret'),
          },
        },
      ],
    }).compile();

    checkoutService = module.get<CheckoutService>(CheckoutService);
    bookingsService = module.get<BookingsService>(BookingsService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    stripeService = module.get<StripeService>(StripeService);

    (getPriceDetails as jest.Mock).mockReturnValue({ totalPrice: 10000 });
  });

  describe('createCheckoutSession', () => {
    it('creates a checkout session successfully', async () => {
      const result = await checkoutService.createCheckoutSession('booking_id', 'account_id');

      expect(bookingsService.getBookingById).toHaveBeenCalledWith('booking_id', 'account_id');
      expect(paymentsService.getPaymentByBookingId).toHaveBeenCalledWith('booking_id');
      expect(getPriceDetails).toHaveBeenCalledWith(mockBooking);
      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(10000, {
        bookingId: 'booking_id',
        accountId: 'account_id',
      });
      expect(result).toEqual({
        priceDetails: { totalPrice: 10000 },
        booking: mockBooking,
        paymentToken: 'mock_client_secret',
      });
    });

    it('throws BadRequestException if booking does not exist', async () => {
      (bookingsService.getBookingById as jest.Mock).mockResolvedValue(null);

      await expect(checkoutService.createCheckoutSession('invalid_booking_id', 'account_id')).rejects.toThrow(
        new BadRequestException('Booking does not exist'),
      );
    });

    it('throws ConflictException if payment already exists and is successful', async () => {
      (paymentsService.getPaymentByBookingId as jest.Mock).mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.Success,
      });

      await expect(checkoutService.createCheckoutSession('booking_id', 'account_id')).rejects.toThrow(
        new ConflictException('This booking has already been paid for'),
      );
    });

    it('handles bookings with no existing payments', async () => {
      (paymentsService.getPaymentByBookingId as jest.Mock).mockResolvedValue(null);

      const result = await checkoutService.createCheckoutSession('booking_id', 'account_id');

      expect(result).toEqual({
        priceDetails: { totalPrice: 10000 },
        booking: mockBooking,
        paymentToken: 'mock_client_secret',
      });
    });
  });
});
