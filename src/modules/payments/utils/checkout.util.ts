import { type Booking } from '#/modules/bookings/entities/booking.entity';
import { time } from '#/shared/libs/time.lib';
import { SERVICE_FEE_PERCENTAGE } from '../constants/service-fee.constant';

export function getPriceDetails(booking: Booking) {
  const pricePerNight = booking.accommodation.price;
  const numberOfNights = getNumberOfNights(booking.startDate, booking.endDate);
  const totalPriceOfNights = pricePerNight * numberOfNights;
  const serviceFee = totalPriceOfNights * SERVICE_FEE_PERCENTAGE;
  const totalPrice = totalPriceOfNights + serviceFee;

  return { numberOfNights, totalPriceOfNights, serviceFee, totalPrice };
}

function getNumberOfNights(start: Date, end: Date) {
  const startDate = time(start);
  const endDate = time(end);

  return Math.max(0, endDate.diff(startDate, 'day'));
}
