import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
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
  @IsNotEmpty()
  name?: string | undefined;

  @ApiProperty({
    description: 'Description of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string | undefined;

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
  @IsNotEmpty()
  price?: number | undefined;

  @ApiProperty({
    description: 'Availability status of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean | undefined;

  @ApiProperty({
    description: 'Date when accommodation becomes available',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  availableFrom?: string | undefined;

  @ApiProperty({
    description: 'Date when accommodation is no longer available',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  availableTo?: string | undefined;

  @ApiProperty({
    description: 'Total square meters of the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  squareMeters?: number | undefined;

  @ApiProperty({
    description: 'Number of rooms in the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfRooms?: number | undefined;

  @ApiProperty({
    description: 'Allowed number of people in the accommodation',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  allowedNumberOfPeople?: number | undefined;

  @ApiProperty({
    description: 'Images related to the accommodation',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AccommodationImageDto)
  images?: AccommodationImageDto[] | undefined;

  @ApiProperty({
    description: 'Amenities related to the accommodation',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccommodationAmenityDto)
  amenity?: AccommodationAmenityDto | undefined;

  @ApiProperty({
    description: 'Address related to the accommodation',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAccommodationAddressDto)
  address?: UpdateAccommodationAddressDto | undefined;
}
