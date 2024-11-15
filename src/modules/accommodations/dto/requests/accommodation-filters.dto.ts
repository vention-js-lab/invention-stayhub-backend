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
} from '#/shared/transformers/transform-type.transformer';

export class AccommodationFiltersQueryDto {
  @ApiProperty({
    name: 'min-price',
    description: 'Minimum price for accommodation',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @TransformToNumber()
  minPrice: number | undefined;

  @ApiProperty({
    name: 'max-price',
    description: 'Maximum price for accommodation',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(1, { message: 'Price maximum must be greater than or equal to 1' })
  @TransformToNumber()
  maxPrice: number | undefined;

  @ApiProperty({
    description: 'Search by name and description of accommodation',
    required: false,
    type: String,
    example: 'luxury',
  })
  @IsOptional()
  @IsString()
  search: string | undefined;

  @ApiProperty({
    description: 'Street address of the accommodation',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  street: string | undefined;

  @ApiProperty({
    description: 'City of the accommodation',
    required: false,
    type: String,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city: string | undefined;

  @ApiProperty({
    description: 'Country of the accommodation',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  country: string | undefined;

  @ApiProperty({
    description: 'Availability status of the accommodation',
    required: false,
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  available: boolean | undefined;

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
  availableFrom: Date | undefined;

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
  availableTo: Date | undefined;

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
  rooms: number | undefined;

  @ApiProperty({
    name: 'has-wifi',
    description: 'Accommodation has Wifi',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  hasWifi: boolean | undefined;

  @ApiProperty({
    name: 'has-parking',
    description: 'Accommodation has parking',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasParking: boolean | undefined;

  @ApiProperty({
    name: 'has-swimming-pool',
    description: 'Accommodation has a swimming pool',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasSwimmingPool: boolean | undefined;

  @ApiProperty({
    name: 'has-pet-allowance',
    description: 'Accommodation allows pets',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasPetAllowance: boolean | undefined;

  @ApiProperty({
    name: 'has-backyard',
    description: 'Accommodation has a backyard',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasBackyard: boolean | undefined;

  @ApiProperty({
    name: 'has-smoking-allowance',
    description: 'Accommodation allows smoking',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasSmokingAllowance: boolean | undefined;

  @ApiProperty({
    name: 'has-hospital-nearby',
    description: 'Accommodation is close to a hospital',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasHospitalNearby: boolean | undefined;

  @ApiProperty({
    name: 'has-laundary-service',
    description: 'Accommodation provides laundry service',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasLaundryService: boolean | undefined;

  @ApiProperty({
    name: 'has-kitchen',
    description: 'Accommodation has a kitchen',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasKitchen: boolean | undefined;

  @ApiProperty({
    name: 'has-air-conditioning',
    description: 'Accommodation has air conditioning',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasAirConditioning: boolean | undefined;

  @ApiProperty({
    name: 'has-tv',
    description: 'Accommodation has a TV',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasTv: boolean | undefined;

  @ApiProperty({
    name: 'has-airport-transfer',
    description: 'Accommodation provides airport transfer',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  hasAirportTransfer: boolean | undefined;

  @ApiProperty({
    name: 'is-close-to-center',
    description: 'Accommodation is close to the center',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isCloseToCenter: boolean | undefined;

  @ApiProperty({
    name: 'is-child-friendly',
    description: 'Accommodation is in child-friendly area',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isChildFriendly: boolean | undefined;

  @ApiProperty({
    name: 'is-quiet-area',
    description: 'Accommodation is in a quiet area',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isQuietArea: boolean | undefined;
}
