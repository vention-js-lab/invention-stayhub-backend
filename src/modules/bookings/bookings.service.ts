import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';
import { CreateBookingDto } from './dto/request/create-booking.req';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { time } from '#/shared/libs/time.lib';

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

  async getBookingById(bookingId: string, accountId: string) {
    const existingBooking = await this.bookingRepository.findOne({
      where: { id: bookingId, accountId },
      relations: ['accommodation'],
    });

    return existingBooking;
  }

  async updateStatus({ bookingId, newStatus }: { bookingId: string; newStatus: BookingStatus }) {
    const existingBooking = await this.bookingRepository.findOneBy({
      id: bookingId,
    });

    if (!existingBooking) {
      throw new BadRequestException('Booking does not exist');
    }

    existingBooking.status = newStatus;

    await this.bookingRepository.save(existingBooking);
  }
}
