import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';

@Entity('accommodation_amenity')
export class AccommodationAmenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  hasWifi: boolean;

  @Column({ default: false })
  hasParking: boolean;

  @Column({ default: false })
  hasSwimmingPool: boolean;

  @Column({ default: false })
  hasPetAllowance: boolean;

  @Column({ default: false })
  hasBackyard: boolean;

  @Column({ default: false })
  hasSmokingAllowance: boolean;

  @Column({ default: false })
  hasHospitalNearby: boolean;

  @Column({ default: false })
  hasLaundryService: boolean;

  @Column({ default: false })
  hasKitchen: boolean;

  @Column({ default: false })
  hasAirConditioning: boolean;

  @Column({ default: false })
  hasTv: boolean;

  @Column({ default: false })
  hasAirportTransfer: boolean;

  @Column({ default: false })
  isCloseToCenter: boolean;

  @Column({ default: false })
  isChildFriendly: boolean;

  @Column({ default: false })
  isQuietArea: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Accommodation, (accommodation) => accommodation.amenity, {
    onDelete: 'CASCADE',
  })
  accommodation: Accommodation;
}
