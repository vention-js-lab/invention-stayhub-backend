import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { getPriceDetails } from '../utils/checkout.util';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';

@Injectable()
export class CheckoutService {
  constructor(
    private bookingsService: BookingsService,
    private paymentsService: PaymentsService,
    private stripeService: StripeService,
  ) {}

  async createCheckoutSession(bookingId: string, accountId: string) {
    const existingBooking = await this.bookingsService.getBookingById(bookingId, accountId);

    if (!existingBooking) {
      throw new BadRequestException('Booking does not exist');
    }

    const existingPayment = await this.paymentsService.getPaymentByBookingId(bookingId);

    if (existingPayment && existingPayment.status === PaymentStatus.Success) {
      throw new ConflictException('This booking has already been paid for');
    }

    const priceDetails = getPriceDetails(existingBooking);
    const clientSecret = await this.stripeService.createPaymentIntent(priceDetails.totalPrice, {
      bookingId,
      accountId,
    });

    return {
      priceDetails,
      booking: existingBooking,
      paymentToken: clientSecret,
    };
  }
}
