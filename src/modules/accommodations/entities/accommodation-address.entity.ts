import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';

@Entity('accommodation_address')
export class AccommodationAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true, name: 'zip_code' })
  zipCode: string;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Accommodation, (accommodation) => accommodation.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodation_id' })
  accommodation: Accommodation;
  @Column({ name: 'accommodation_id' })
  accommodationId: string;
}
