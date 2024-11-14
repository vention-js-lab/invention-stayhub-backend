import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AccommodationImageDto {
  @ApiProperty({ description: 'URL of the image' })
  @IsString()
  url: string;
}
