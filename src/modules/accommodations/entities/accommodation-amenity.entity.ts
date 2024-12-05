import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';

@Entity('accommodation_amenity')
export class AccommodationAmenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false, name: 'has_wifi' })
  hasWifi: boolean;

  @Column({ default: false, name: 'has_parking' })
  hasParking: boolean;

  @Column({ default: false, name: 'has_swimming_pool' })
  hasSwimmingPool: boolean;

  @Column({ default: false, name: 'has_pet_allowance' })
  hasPetAllowance: boolean;

  @Column({ default: false, name: 'has_backyard' })
  hasBackyard: boolean;

  @Column({ default: false, name: 'has_smoking_allowance' })
  hasSmokingAllowance: boolean;

  @Column({ default: false, name: 'has_hospital_nearby' })
  hasHospitalNearby: boolean;

  @Column({ default: false, name: 'has_laundry_service' })
  hasLaundryService: boolean;

  @Column({ default: false, name: 'has_kitchen' })
  hasKitchen: boolean;

  @Column({ default: false, name: 'has_air_conditioning' })
  hasAirConditioning: boolean;

  @Column({ default: false, name: 'has_tv' })
  hasTv: boolean;

  @Column({ default: false, name: 'has_airport_transfer' })
  hasAirportTransfer: boolean;

  @Column({ default: false, name: 'is_close_to_center' })
  isCloseToCenter: boolean;

  @Column({ default: false, name: 'is_child_friendly' })
  isChildFriendly: boolean;

  @Column({ default: false, name: 'is_quiet_area' })
  isQuietArea: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Accommodation, (accommodation) => accommodation.amenity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodation_id' })
  accommodation: Accommodation;

  @Column({ name: 'accommodation_id' })
  accommodationId: string;
}
