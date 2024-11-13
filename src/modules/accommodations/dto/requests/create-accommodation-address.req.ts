import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AccommodationAddressDto {
  @ApiProperty({ description: 'Street name of the accommodation' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City of the accommodation' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Country of the accommodation' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Zip code of the accommodation' })
  @IsOptional()
  @IsString()
  zip_code: string;

  @ApiProperty({ description: 'Latitude of the accommodation' })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a valid number' })
  latitude: number;

  @ApiProperty({ description: 'Longitude of the accommodation' })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a valid number' })
  longitude: number;
}
