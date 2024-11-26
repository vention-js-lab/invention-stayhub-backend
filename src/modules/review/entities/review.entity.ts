import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { Account } from '#/modules/users/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @ManyToOne(() => Account, (account) => account.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodation_id' })
  accommodation: Accommodation;

  @Column({ name: 'accommodation_id' })
  accommodationId: string;

  @OneToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ name: 'booking_id' })
  bookingId: string;
}
