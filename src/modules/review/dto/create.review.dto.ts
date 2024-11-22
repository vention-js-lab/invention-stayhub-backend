import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Content of the review.',
    example: 'Great accommodation, would stay again!',
  })
  @IsNotEmpty({ message: 'Content is required.' })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Rating for the accommodation (from 1 to 5).',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  @IsNotEmpty({ message: 'Rating is required.' })
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'ID of the accommodation being reviewed.',
    example: 'b4a0d758-b573-4005-8e4e-fd545bd9d500',
  })
  @IsNotEmpty({ message: 'Accommodation ID is required.' })
  @IsUUID('4', { message: 'Accommodation ID must be a valid UUID.' })
  @IsString()
  accommodationId: string;

  @ApiProperty({
    description: 'ID of the booking associated with the review.',
    example: '3d9a9b17-c6a6-43f2-a16d-5f015e5faeb1',
  })
  @IsNotEmpty({ message: 'Booking ID is required.' })
  @IsUUID('4', { message: 'Booking ID must be a valid UUID.' })
  @IsString()
  bookingId: string;
}
