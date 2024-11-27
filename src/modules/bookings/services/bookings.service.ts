import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingStatus } from '#/shared/constants/booking-status.constant';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
  ) {}

  async createBooking(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const { accommodationId, startDate, endDate } = createBookingDto;

    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    if (!accommodation.available) {
      throw new BadRequestException('Accommodation is not available');
    }

    accommodation.available = false;
    await this.accommodationRepository.save(accommodation);
    const booking = this.bookingRepository.create({
      startDate,
      endDate,
      status: BookingStatus.Pending,
      accountId: userId,
      accommodationId: accommodation.id,
    });

    return this.bookingRepository.save(booking);
  }

  async getBookingById(bookingId: string, accountId?: string) {
    const existingBooking = await this.bookingRepository.findOneBy({
      id: bookingId,
      accountId: accountId,
    });

    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }

    return existingBooking;
  }

  async updateBookingStatus({
    bookingId,
    newStatus,
  }: {
    bookingId: string;
    newStatus: BookingStatus;
  }) {
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
