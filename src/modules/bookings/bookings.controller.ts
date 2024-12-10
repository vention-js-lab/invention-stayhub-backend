import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common/';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/request/create-booking.req';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

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
  async getUserBookings(@GetAccount('accountId') accountId: string) {
    const result = await this.bookingsService.getUserBookings(accountId);

    return withBaseResponse({
      status: 200,
      message: 'User bookings successfully received',
      data: result,
    });
  }
}
