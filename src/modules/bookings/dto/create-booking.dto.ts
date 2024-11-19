import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID of the accommodation being booked' })
  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  accommodationId: string;

  @ApiProperty({ description: 'Start date of the booking in ISO format' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date of the booking in ISO format' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
