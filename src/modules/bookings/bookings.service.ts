import { UpdateBookingStatusDto } from './dto/request/update-booking-status.req';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';
import { CreateBookingDto } from './dto/request/create-booking.req';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { time } from '#/shared/libs/time.lib';
import { categorizeBookings } from './utils/bookings-categorize.util';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Accommodation) private accommodationRepository: Repository<Accommodation>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { accommodationId, startDate, endDate } = createBookingDto;

    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    const parsedStartDate = time(startDate).toDate();
    const parsedEndDate = time(endDate).toDate();

    const overlappingBookings = await this.bookingRepository.find({
      where: [
        {
          accommodationId,
          startDate: Between(parsedStartDate, parsedEndDate),
        },
        {
          accommodationId,
          endDate: Between(parsedStartDate, parsedEndDate),
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      throw new BadRequestException('The selected dates are not available');
    }

    const booking = this.bookingRepository.create({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      status: BookingStatus.Pending,
      accountId: userId,
      accommodationId,
    });

    return this.bookingRepository.save(booking);
  }

  async getUserBookings(accountId: string) {
    const userBookings = await this.bookingRepository.find({
      where: { accountId },
      relations: ['accommodation', 'accommodation.address', 'accommodation.images'],
    });

    const categorizedBookings = categorizeBookings(userBookings);

    return categorizedBookings;
  }

  async getBookingById(bookingId: string, accountId: string) {
    const existingBooking = await this.bookingRepository.findOne({
      where: { id: bookingId, accountId },
      relations: ['accommodation'],
    });

    return existingBooking;
  }

  async updateStatus(bookingId: string, updateBookingStatusDto: UpdateBookingStatusDto) {
    const existingBooking = await this.bookingRepository.findOneBy({
      id: bookingId,
    });

    if (!existingBooking) {
      throw new BadRequestException('Booking does not exist');
    }

    existingBooking.status = updateBookingStatusDto.newStatus;

    await this.bookingRepository.save(existingBooking);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateBookingStatuses() {
    const today = time().startOf('day').toDate();

    const upcomingBookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.Upcoming,
        startDate: LessThanOrEqual(today),
      },
    });

    for (const booking of upcomingBookings) {
      booking.status = BookingStatus.Active;
    }
    await this.bookingRepository.save(upcomingBookings);

    const activeBookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.Active,
        endDate: LessThanOrEqual(today),
      },
    });

    for (const booking of activeBookings) {
      booking.status = BookingStatus.Completed;
    }
    await this.bookingRepository.save(activeBookings);
  }
}
