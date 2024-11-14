import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  TransformToBoolean,
  TransformToDate,
  TransformToNumber,
} from '#/shared/utils/transform-type.util';

export class AccommodationFiltersQueryDto {
  // PRICE
  @ApiProperty({
    name: 'min-price',
    description: 'Minimum price for accommodation',
    required: false,
    type: Number,
    example: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @TransformToNumber()
  minPrice?: number;

  @ApiProperty({
    name: 'max-price',
    description: 'Maximum price for accommodation',
    required: false,
    type: Number,
    example: 500,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(1, { message: 'Price maximum must be greater than or equal to 1' })
  @TransformToNumber()
  maxPrice?: number;

  // SEARCH
  @ApiProperty({
    description: 'Search by name and description of accommodation',
    required: false,
    type: String,
    example: 'luxury',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // LOCATION
  @ApiProperty({
    description: 'Street address of the accommodation',
    required: false,
    type: String,
    example: 'Main St',
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({
    description: 'City of the accommodation',
    required: false,
    type: String,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Country of the accommodation',
    required: false,
    type: String,
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;

  // AVAILABLE
  @ApiProperty({
    description: 'Availability status of the accommodation',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({
    name: 'available-from',
    description: 'Availability start date',
    required: false,
    type: String,
    example: '2024-11-15',
  })
  @IsOptional()
  @IsDate()
  @TransformToDate()
  availableFrom?: Date;

  @ApiProperty({
    name: 'available-to',
    description: 'Availability end date',
    required: false,
    type: String,
    example: '2024-12-15',
  })
  @IsOptional()
  @IsDate()
  @TransformToDate()
  availableTo?: Date;

  // ROOMS
  @ApiProperty({
    description: 'Number of rooms in the accommodation',
    required: false,
    type: Number,
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(1, { message: 'Rooms must be greater than or equal to 1' })
  @TransformToNumber()
  rooms?: number;

  // AMENITIES
  @ApiProperty({
    name: 'has-wifi',
    description: 'Accommodation has Wifi',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  hasWifi?: boolean;

  @ApiProperty({
    name: 'has-parking',
    description: 'Accommodation has parking',
    required: false,
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasParking?: boolean;

  @ApiProperty({
    name: 'has-swimming-pool',
    description: 'Accommodation has a swimming pool',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasSwimmingPool?: boolean;

  @ApiProperty({
    name: 'has-pet-allowance',
    description: 'Accommodation allows pets',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasPetAllowance?: boolean;

  @ApiProperty({
    name: 'has-backyard',
    description: 'Accommodation has a backyard',
    required: false,
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasBackyard?: boolean;

  @ApiProperty({
    name: 'has-smoking-allowance',
    description: 'Accommodation allows smoking',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasSmokingAllowance?: boolean;

  @ApiProperty({
    name: 'has-hospital-nearby',
    description: 'Accommodation is close to a hospital',
    required: false,
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasHospitalNearby?: boolean;

  @ApiProperty({
    name: 'has-laundary-service',
    description: 'Accommodation provides laundry service',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasLaundryService?: boolean;

  @ApiProperty({
    name: 'has-kitchen',
    description: 'Accommodation has a kitchen',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasKitchen?: boolean;

  @ApiProperty({
    name: 'has-air-conditioning',
    description: 'Accommodation has air conditioning',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasAirConditioning?: boolean;

  @ApiProperty({
    name: 'has-tv',
    description: 'Accommodation has a TV',
    required: false,
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasTv?: boolean;

  @ApiProperty({
    name: 'has-airport-transfer',
    description: 'Accommodation provides airport transfer',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasAirportTransfer?: boolean;

  @ApiProperty({
    name: 'is-close-to-center',
    description: 'Accommodation is close to the center',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isCloseToCenter?: boolean;

  @ApiProperty({
    name: 'is-child-friendly',
    description: 'Accommodation is in child-friendly area',
    required: false,
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isChildFriendly?: boolean;

  @ApiProperty({
    name: 'is-quiet-area',
    description: 'Accommodation is in a quiet area',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isQuietArea?: boolean;
}
