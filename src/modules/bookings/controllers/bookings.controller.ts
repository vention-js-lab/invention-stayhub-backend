import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/modules/auth/decorators/get-account.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GetAccount('accountId') userId: string,
  ) {
    return this.bookingsService.createBooking(createBookingDto, userId);
  }
}
