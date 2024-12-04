import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Content of the review.',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Rating for the accommodation (from 1 to 5).',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty({ message: 'Rating is required.' })
  @IsNumber({}, { message: 'Rating must be a number.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  rating: number;

  @ApiProperty({
    description: 'ID of the booking associated with the review.',
  })
  @IsNotEmpty()
  @IsUUID('4')
  @IsString()
  bookingId: string;

  @ApiProperty({
    description: 'ID of the accommodation associated with the review',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  accommodationId: string;
}
