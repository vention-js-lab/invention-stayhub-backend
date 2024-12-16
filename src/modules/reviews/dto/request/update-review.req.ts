import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
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
  @IsOptional()
  @IsNotEmpty({ message: 'Rating is required.' })
  @IsNumber({}, { message: 'Rating must be a number.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  rating: number;
}
