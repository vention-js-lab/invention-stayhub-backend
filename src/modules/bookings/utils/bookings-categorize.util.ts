import { type BookingStatus } from '#/shared/constants/booking-status.constant';
import { type Booking } from '../entities/booking.entity';

type CategorizedBookings = {
  [key in BookingStatus]: Booking[];
};

export function categorizeBookings(bookings: Booking[]) {
  const categorized: CategorizedBookings = {
    pending: [],
    active: [],
    inactive: [],
    upcoming: [],
    completed: [],
    cancelled: [],
  };

  bookings.forEach((booking) => {
    const { status } = booking;

    if (status in categorized) {
      categorized[status].push(booking);
    }
  });

  return categorized;
}
