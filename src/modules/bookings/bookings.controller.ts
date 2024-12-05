import { Controller, Post, Body, UseGuards } from '@nestjs/common/';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/request/create-booking.req';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/shared/decorators/get-account.decorator';

@ApiTags('bookings')
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
  create(@Body() createBookingDto: CreateBookingDto, @GetAccount('accountId') userId: string) {
    return this.bookingsService.createBooking(createBookingDto, userId);
  }
}
