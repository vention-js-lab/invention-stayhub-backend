import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '#/shared/constants/booking-status.constant';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    description: 'The new status of the booking',
    example: BookingStatus.Active,
  })
  @IsEnum(BookingStatus, { message: 'New status must be a valid to booking status value' })
  newStatus: BookingStatus;
}
