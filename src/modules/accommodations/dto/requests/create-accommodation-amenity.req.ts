import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';

export class AccommodationAmenityDto {
  @ApiProperty({ description: 'Indicates if the accommodation has Wi-Fi' })
  @IsBoolean()
  @IsOptional()
  hasWifi: boolean;

  @ApiProperty({ description: 'Indicates if the accommodation has parking' })
  @IsBoolean()
  @IsOptional()
  hasParking: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation has a swimming pool',
  })
  @IsBoolean()
  @IsOptional()
  hasSwimmingPool: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation has a pet allowance',
  })
  @IsOptional()
  @IsBoolean()
  hasPetAllowance: boolean;

  @ApiProperty({ description: 'Indicates if the accommodation has a backyard' })
  @IsBoolean()
  @IsOptional()
  hasBackyard: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation has smoking allowance',
  })
  @IsBoolean()
  @IsOptional()
  hasSmokingAllowance: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation is close to a hospital',
  })
  @IsBoolean()
  @IsOptional()
  hasHospitalNearby: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation offers laundry service',
  })
  @IsBoolean()
  @IsOptional()
  hasLaundryService: boolean;

  @ApiProperty({ description: 'Indicates if the accommodation has a kitchen' })
  @IsBoolean()
  @IsOptional()
  hasKitchen: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation has air conditioning',
  })
  @IsBoolean()
  @IsOptional()
  hasAirConditioning: boolean;

  @ApiProperty({ description: 'Indicates if the accommodation has a TV' })
  @IsBoolean()
  @IsOptional()
  hasTv: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation offers airport transfer',
  })
  @IsBoolean()
  @IsOptional()
  hasAirportTransfer: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation is close to the center',
  })
  @IsBoolean()
  @IsOptional()
  isCloseToCenter: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation is child-friendly',
  })
  @IsBoolean()
  @IsOptional()
  isChildFriendly: boolean;

  @ApiProperty({
    description: 'Indicates if the accommodation is in a quiet area',
  })
  @IsBoolean()
  @IsOptional()
  isQuietArea: boolean;

  @OneToOne(() => Accommodation, (accommodation) => accommodation.amenity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodation_id' })
  accommodation: Accommodation;

  @Column({ name: 'accommodation_id' })
  accommodationId: string;
}

AccommodationAmenityDto;
