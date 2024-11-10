import { Account } from '#/modules/user/entities/account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account_refresh_token')
export class AccountRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  user: Account;

  @Column({ name: 'account_id' })
  userId: string;

  @Column({ name: 'is_deleted', default: 'false' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: number;
}
