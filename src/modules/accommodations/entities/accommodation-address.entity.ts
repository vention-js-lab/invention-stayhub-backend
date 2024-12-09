import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';

@Entity('accommodation_address')
export class AccommodationAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
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
