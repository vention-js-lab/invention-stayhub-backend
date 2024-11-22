import {
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Entity,
} from 'typeorm';
import { Gender } from '#/shared/constants/gender.constant';
import { Account } from './account.entity';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  country: string;

  @Column()
  description: string;

  @Column({
    name: 'phone_number',
  })
  phoneNumber: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'account_id' })
  accountId: string;

  @OneToOne(() => Account, (account) => account.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
