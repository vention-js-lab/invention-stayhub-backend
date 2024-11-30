import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '#/shared/constants/user-roles.constant';
import { AccountType } from '#/shared/constants/user-account.constant';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { Profile } from './profile.entity';
import { Review } from '#/modules/review/entities/review.entity';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  password: string | null;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  role: Roles;

  @Column({ unique: true, name: 'google_id', nullable: true, type: 'varchar' })
  googleId: string | null;

  @Column({ type: 'enum', name: 'type', enum: AccountType })
  type: AccountType;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: () => null,
  })
  deletedAt: Date | null;

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

  @OneToMany(() => Accommodation, (accommodation) => accommodation.owner)
  accommodations: Accommodation[];

  @OneToOne(() => Profile, (profile) => profile.account)
  profile: Profile;

  @OneToMany(() => Review, (review) => review.account)
  reviews: Review[];
}
