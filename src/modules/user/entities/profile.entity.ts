import {
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accommodation } from '@accommodations/entities/accommodations.entity';
import { Gender } from '../../../shared/constants/gender.constant';

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

  @Column({ nullable: true, name: 'picture' })
  picture: string;

  @Column({ nullable: true, name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

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

  @OneToMany(() => Accommodation, (accommodation) => accommodation.user)
  accommodations: Accommodation[];
}
