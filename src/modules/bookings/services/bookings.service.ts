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
import { Between } from 'typeorm';

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

    const overlappingBookings = await this.bookingRepository.find({
      where: [
        {
          accommodationId,
          startDate: Between(new Date(startDate), new Date(endDate)),
        },
        {
          accommodationId,
          endDate: Between(new Date(startDate), new Date(endDate)),
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      throw new BadRequestException('The selected dates are not available');
    }

    const booking = this.bookingRepository.create({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: BookingStatus.Pending,
      accountId: userId,
      accommodationId,
    });

    return this.bookingRepository.save(booking);
  }
}
