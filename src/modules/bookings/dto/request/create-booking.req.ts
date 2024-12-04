import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, Validate } from 'class-validator';
import { IsFutureDate, IsStartDateBeforeEndDate } from '#/modules/bookings/validators/date-validators';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID of the accommodation being booked' })
  @IsUUID()
  accommodationId: string;

  @ApiProperty({ description: 'Start date of the booking in ISO format' })
  @IsDateString()
  @Validate(IsFutureDate, { message: 'Start date must not be in the past' })
  startDate: string;

  @ApiProperty({ description: 'End date of the booking in ISO format' })
  @IsDateString()
  endDate: string;

  @Validate(IsStartDateBeforeEndDate)
  validateDates() {
    return { startDate: this.startDate, endDate: this.endDate };
  }
}
