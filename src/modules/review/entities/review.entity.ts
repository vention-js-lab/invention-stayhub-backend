import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { Account } from '#/modules/users/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '#/modules/bookings/entities/booking.entity';
import { Max, Min } from 'class-validator';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true })
  content: string | null;

  @Column({ nullable: false })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  rating: number;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'account_id' })
  account: Account | null;

  @Column({ name: 'account_id' })
  accountId: string | null;

  @ManyToOne(() => Accommodation, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'accommodation_id' })
  accommodation: Accommodation | null;

  @Column({ name: 'accommodation_id' })
  accommodationId: string | null;

  @ManyToOne(() => Booking, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking | null;

  @Column({ name: 'accommodation_id' })
  bookingId: string | null;
}
