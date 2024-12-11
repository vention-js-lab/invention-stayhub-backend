import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '#/shared/constants/booking-status.constant';

export class UpdateBookingStatusDto {
  @ApiProperty({ description: 'New booking status' })
  @IsEnum(BookingStatus)
  newStatus: BookingStatus;
}
