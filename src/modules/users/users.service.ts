import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { UpdateProfileDto } from './dto/requests/update-profile.dto';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Account)
    private userAccountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private userProfileRepository: Repository<Profile>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async listUsers() {
    const users = await this.userAccountRepository.find({
      select: ['id', 'email', 'isDeleted', 'role', 'createdAt', 'updatedAt'],
    });

    return users;
  }

  async getProfile(accountId: string) {
    const account = await this.userAccountRepository.findOne({
      where: { id: accountId, isDeleted: false },
      relations: ['profile'],
    });
    if (!account || !account.profile) {
      throw new NotFoundException('Account not found');
    }

    return account.profile;
  }

  async getUserWishlist(accountId: string) {
    const account = await this.userAccountRepository.findOne({
      where: { id: accountId, isDeleted: false },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const userWishlist = await this.wishlistRepository.find({
      where: {
        accountId,
      },
    });

    return userWishlist;
  }

  async updateProfile(accountId: string, updateProfileDto: UpdateProfileDto) {
    const account = await this.userAccountRepository.findOne({
      where: { id: accountId, isDeleted: false },
      relations: ['profile'],
    });
    if (!account || !account.profile) {
      throw new NotFoundException('Account not found');
    }

    Object.assign(account.profile, updateProfileDto);

    const savedProfile = await this.userProfileRepository.save(account.profile);
    return savedProfile;
  }

  async updateProfileAvatar(accountId: string, avatarUrl: string) {
    const account = await this.userAccountRepository.findOne({
      where: { id: accountId, isDeleted: false },
      relations: ['profile'],
    });
    if (!account || !account.profile) {
      throw new NotFoundException('Account not found');
    }

    account.profile.image = avatarUrl;

    const savedProfile = await this.userProfileRepository.save(account.profile);
    return savedProfile;
  }

  async toggleUserRole(accountId: string) {
    const account = await this.userAccountRepository.findOne({
      where: { id: accountId, isDeleted: false },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.role = account.role === Roles.Admin ? Roles.User : Roles.Admin;

    const updatedUser = await this.userAccountRepository.save(account);
    return updatedUser;
  }

  async deleteAccount(deleterId: string, deletingAccountId: string) {
    const deleter = await this.userAccountRepository.findOne({
      where: { id: deleterId, isDeleted: false },
    });
    if (deleter.role != Roles.Admin && deleterId != deletingAccountId) {
      throw new ForbiddenException('Only owner or admin can delete account');
    }

    const deletingUser = await this.userAccountRepository.findOne({
      where: { id: deletingAccountId, isDeleted: false },
    });
    if (!deletingUser) {
      throw new NotFoundException('User not found or already deleted');
    }

    deletingUser.isDeleted = true;
    const deletedUser = await this.userAccountRepository.save(deletingUser);

    const { ...result } = deletedUser;
    delete result.password;

    return result;
  }
}
