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
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  role: Roles;

  @Column({ unique: true, name: 'google_id', nullable: true })
  googleId: string;

  @Column({ type: 'enum', name: 'type', enum: AccountType })
  type: AccountType;

  @Column({
    type: 'boolean',
    name: 'is_deleted',
    nullable: false,
    default: false,
  })
  isDeleted: boolean;

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: () => null,
  })
  deletedAt: Date;

  @OneToMany(() => Accommodation, (accommodation) => accommodation.owner)
  accommodations: Accommodation[];

  @OneToOne(() => Profile, (profile) => profile.account)
  profile: Profile;
}
