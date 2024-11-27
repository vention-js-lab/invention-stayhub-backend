import { UpdateProfileDto } from './dto/requests/update-profile.req';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { Roles } from '#/shared/constants/user-roles.constant';
import { UserFiltersReqQueryDto } from './dto/requests/users-filters.req';
import { addUserFilters } from './helpers/users-filters.util';
import { paginationParams } from '../accommodations/utils/pagination-params.util';
import {
  getPaginationMetadata,
  getPaginationOffset,
} from '#/shared/utils/pagination.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async listUsers(filters: UserFiltersReqQueryDto) {
    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.profile', 'profile')
      .select([
        'account.id',
        'account.email',
        'profile.firstName',
        'profile.lastName',
        'profile.phoneNumber',
        'profile.gender',
        'profile.country',
        'account.role',
        'account.createdAt',
        'account.deletedAt',
      ])
      .withDeleted();

    addUserFilters(queryBuilder, filters);

    const { page, limit } = paginationParams(filters);
    const { skip, take } = getPaginationOffset(page, limit);
    queryBuilder.skip(skip).take(take);

    const [result, total] = await queryBuilder.getManyAndCount();
    const metadata = getPaginationMetadata({ page, limit, total });
    return {
      result,
      metadata,
    };
  }

  async getProfile(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, deletedAt: null },
      relations: ['profile'],
    });

    return account.profile;
  }

  async updateProfile(accountId: string, updateProfileDto: UpdateProfileDto) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, deletedAt: null },
      relations: ['profile'],
    });

    Object.assign(account.profile, updateProfileDto);

    const savedProfile = await this.profileRepository.save(account.profile);
    return savedProfile;
  }

  async updateProfileAvatar(accountId: string, avatarUrl: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, deletedAt: null },
      relations: ['profile'],
    });

    account.profile.image = avatarUrl;

    const savedProfile = await this.profileRepository.save(account.profile);
    return savedProfile;
  }

  async toggleUserRole(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, deletedAt: null },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.role = account.role === Roles.Admin ? Roles.User : Roles.Admin;

    const updatedUser = await this.accountRepository.save(account);
    return updatedUser;
  }

  async softDeleteAccount(deleteActorId: string, deletingAccountId: string) {
    const deleteActor = await this.accountRepository.findOne({
      where: { id: deleteActorId, deletedAt: null },
    });
    if (deleteActor.role != Roles.Admin && deleteActorId != deletingAccountId) {
      throw new ForbiddenException('Only owner or admin can delete account');
    }

    const deletingAccount = await this.accountRepository.findOne({
      where: { id: deletingAccountId, deletedAt: null },
    });
    if (!deletingAccount) {
      throw new NotFoundException('User not found or already deleted');
    }

    if (deletingAccount.role === Roles.Admin) {
      const remainingAdmins = await this.accountRepository.count({
        where: {
          role: Roles.Admin,
          deletedAt: null,
        },
      });

      if (remainingAdmins === 1) {
        throw new ForbiddenException('Cannot delete the last admin');
      }
    }

    await this.accountRepository.softRemove(deletingAccount);
  }
}
