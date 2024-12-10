import { UpdateBookingStatusDto } from './dto/request/update-booking-status.req';
import { Controller, Post, Body, UseGuards, Get, Put, Param } from '@nestjs/common/';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/request/create-booking.req';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { UUIDValidationPipe } from '#/shared/pipes/uuid-validation.pipe';

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

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({
    status: 200,
    description: 'User bookings successfully received.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  async getUserBookings(@GetAccount('accountId') userId: string) {
    const result = await this.bookingsService.getUserBookings(userId);

    return withBaseResponse({
      status: 200,
      message: 'User bookings successfully received',
      data: result,
    });
  }

  @Put(':bookingId')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({
    status: 200,
    description: 'User bookings successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  async updateBookingStatus(
    @Param('bookingId', new UUIDValidationPipe()) bookingId: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    const result = await this.bookingsService.updateStatus(bookingId, updateBookingStatusDto);

    return withBaseResponse({
      status: 200,
      message: 'Booking status successfully updated',
      data: result,
    });
  }
}
