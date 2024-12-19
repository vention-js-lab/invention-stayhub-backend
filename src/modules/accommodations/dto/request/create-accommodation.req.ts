import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDateString, IsNumber, Min, ValidateNested, IsArray } from 'class-validator';
import { AccommodationImageDto } from './create-accommodation-image.req';
import { AccommodationAmenityDto } from './create-accommodation-amenity.req';
import { AccommodationAddressDto } from './create-accommodation-address.req';
import { Type } from 'class-transformer';

export class AccommodationDto {
  @ApiProperty({ description: 'Name of the accommodation' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the accommodation' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Cover image URL of the accommodation' })
  @IsString()
  coverImage: string | undefined;

  @ApiProperty({ description: 'Price per night of the accommodation' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Availability status of the accommodation' })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ description: 'Date when accommodation becomes available' })
  @IsDateString()
  availableFrom: string;

  @ApiProperty({
    description: 'Date when accommodation is no longer available',
  })
  @IsDateString()
  availableTo: string;

  @ApiProperty({ description: 'Total square meters of the accommodation' })
  @IsNumber()
  @Min(1)
  squareMeters: number;

  @ApiProperty({ description: 'Number of rooms in the accommodation' })
  @IsNumber()
  @Min(1)
  numberOfRooms: number;

  @ApiProperty({ description: 'Allowed number of people in the accommodation' })
  @IsNumber()
  allowedNumberOfPeople: number;

  @ApiProperty({ description: 'Categories of the accommodation' })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({ description: 'Images related to the accommodation' })
  @ValidateNested({ each: true })
  @Type(() => AccommodationImageDto)
  images: AccommodationImageDto[];

  @ApiProperty({ description: 'Amenities related to the accommodation' })
  @ValidateNested()
  @Type(() => AccommodationAmenityDto)
  amenity: AccommodationAmenityDto;

  @ApiProperty({ description: 'Address related to the accommodation' })
  @ValidateNested()
  @Type(() => AccommodationAddressDto)
  address: AccommodationAddressDto;
}
