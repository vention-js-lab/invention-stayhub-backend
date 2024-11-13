import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';

export class AccommodationAmenityDto {
  @ApiProperty({ description: 'Indicates if the accommodation has Wi-Fi' })
  @IsBoolean()
  hasWifi: boolean;

  @ApiProperty({ description: 'Indicates if the accommodation has parking' })
  @IsBoolean()
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

  @ApiProperty({ description: 'Date when the amenity was created' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the amenity was last updated' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @OneToOne(() => Accommodation, (accommodation) => accommodation.amenity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodation_id' }) // Explicitly define the column name here
  accommodation: Accommodation;

  @Column({ name: 'accommodation_id' }) // Explicitly define the accommodation_id column
  accommodationId: string;
}

AccommodationAmenityDto;
