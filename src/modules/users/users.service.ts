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
    @InjectRepository(Account) private userAccountRepo: Repository<Account>,
    @InjectRepository(Profile) private userProfileRepo: Repository<Profile>,
    @InjectRepository(Wishlist) private wishlistRepo: Repository<Wishlist>,
  ) {}

  async listUsers() {
    const users = await this.userAccountRepo.find({
      select: ['id', 'email', 'isDeleted', 'role', 'createdAt', 'updatedAt'],
    });

    return users;
  }

  async getProfile(userId: string) {
    const account = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
      relations: ['profile'],
    });
    if (!account || !account.profile) {
      throw new NotFoundException('Account not found');
    }

    return account.profile;
  }

  async getUserWishlist(userId: string) {
    const account = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const userWishlist = await this.wishlistRepo.find({
      where: {
        accountId: userId,
      },
    });

    return userWishlist;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const account = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
      relations: ['profile'],
    });
    if (!account || !account.profile) {
      throw new NotFoundException('Account not found');
    }

    Object.assign(account.profile, updateProfileDto);

    const savedProfile = await this.userProfileRepo.save(account.profile);
    return savedProfile;
  }

  async updateProfileAvatar(userId: string, imgUrl: string) {
    const account = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
      relations: ['profile'],
    });
    if (!account || !account.profile) {
      throw new NotFoundException('Account not found');
    }

    account.profile.image = imgUrl;

    const savedProfile = await this.userProfileRepo.save(account.profile);
    return savedProfile;
  }

  async toggleUserRole(userId: string) {
    const account = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.role = account.role === Roles.Admin ? Roles.User : Roles.Admin;

    const updatedUser = await this.userAccountRepo.save(account);
    return updatedUser;
  }

  async deleteAccount(deleterId: string, deletingUserId: string) {
    const deleter = await this.userAccountRepo.findOne({
      where: { id: deleterId, isDeleted: false },
    });
    if (deleter.role != Roles.Admin && deleterId != deletingUserId) {
      throw new ForbiddenException('Only owner or admin can delete account');
    }

    const deletingUser = await this.userAccountRepo.findOne({
      where: { id: deletingUserId, isDeleted: false },
    });
    if (!deletingUser) {
      throw new NotFoundException('User not found or already deleted');
    }

    deletingUser.isDeleted = true;
    const deletedUser = await this.userAccountRepo.save(deletingUser);

    const { ...result } = deletedUser;
    delete result.password;

    return result;
  }
}
