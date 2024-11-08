import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '#/modules/user/entities/user.entity';
import { AccommodationStatus } from '#/shared/constants/accommodation-status.constants';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.accommodations)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price_per_night' })
  pricePerNight: number;

  @Column()
  type: string;

  @Column('simple-array')
  amenities: string[];

  @Column({
    type: 'enum',
    enum: AccommodationStatus,
    default: AccommodationStatus.AVAILABLE,
  })
  status: AccommodationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
