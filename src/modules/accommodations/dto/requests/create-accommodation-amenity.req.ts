import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';

export class AccommodationAmenityDto {
  @ApiProperty({ description: 'Indicates if the accommodation has Wi-Fi' })
  @IsBoolean()
  @IsOptional()
  hasWifi: boolean | undefined;

  @ApiProperty({ description: 'Indicates if the accommodation has parking' })
  @IsBoolean()
  @IsOptional()
  hasParking: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation has a swimming pool',
  })
  @IsBoolean()
  @IsOptional()
  hasSwimmingPool: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation has a pet allowance',
  })
  @IsBoolean()
  @IsOptional()
  hasPetAllowance: boolean | undefined;

  @ApiProperty({ description: 'Indicates if the accommodation has a backyard' })
  @IsBoolean()
  @IsOptional()
  hasBackyard: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation has smoking allowance',
  })
  @IsBoolean()
  @IsOptional()
  hasSmokingAllowance: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation is close to a hospital',
  })
  @IsBoolean()
  @IsOptional()
  hasHospitalNearby: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation offers laundry service',
  })
  @IsBoolean()
  @IsOptional()
  hasLaundryService: boolean | undefined;

  @ApiProperty({ description: 'Indicates if the accommodation has a kitchen' })
  @IsBoolean()
  @IsOptional()
  hasKitchen: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation has air conditioning',
  })
  @IsOptional()
  @IsBoolean()
  hasAirConditioning: boolean | undefined;

  @ApiProperty({ description: 'Indicates if the accommodation has a TV' })
  @IsBoolean()
  @IsOptional()
  hasTv: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation offers airport transfer',
  })
  @IsBoolean()
  @IsOptional()
  hasAirportTransfer: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation is close to the center',
  })
  @IsBoolean()
  @IsOptional()
  isCloseToCenter: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation is child-friendly',
  })
  @IsBoolean()
  @IsOptional()
  isChildFriendly: boolean | undefined;

  @ApiProperty({
    description: 'Indicates if the accommodation is in a quiet area',
  })
  @IsBoolean()
  @IsOptional()
  isQuietArea: boolean | undefined;

  @OneToOne(() => Accommodation, (accommodation) => accommodation.amenity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodation_id' })
  accommodation: Accommodation;

  @Column({ name: 'accommodation_id' })
  accommodationId: string;
}

AccommodationAmenityDto;
