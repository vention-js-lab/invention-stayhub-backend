import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccommodationImageDto } from './create-accommodation-image.req';
import { AccommodationAmenityDto } from './create-accommodation-amenity.req';
import { UpdateAccommodationAddressDto } from './update-accommodation-address.req';
import { Type } from 'class-transformer';

export class UpdateAccommodationDto {
  @ApiProperty({ description: 'Name of the accommodation', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Description of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Cover image URL of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverImage?: string | undefined;

  @ApiProperty({
    description: 'Price per night of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Availability status of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({
    description: 'Date when accommodation becomes available',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @ApiProperty({
    description: 'Date when accommodation is no longer available',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  availableTo?: string;

  @ApiProperty({
    description: 'Total square meters of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  squareMeters?: number;

  @ApiProperty({
    description: 'Number of rooms in the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfRooms?: number;

  @ApiProperty({
    description: 'Allowed number of people in the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  allowedNumberOfPeople?: number;

  @ApiProperty({
    description: 'Images related to the accommodation',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AccommodationImageDto)
  images?: AccommodationImageDto[];

  @ApiProperty({
    description: 'Amenities related to the accommodation',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccommodationAmenityDto)
  amenity?: AccommodationAmenityDto;

  @ApiProperty({
    description: 'Address related to the accommodation',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAccommodationAddressDto)
  address?: UpdateAccommodationAddressDto;
}
