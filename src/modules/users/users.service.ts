import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const profile = await this.userProfileRepo.findOne({
      where: {
        accountId: { id: userId },
      },
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
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

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    imageUrl: string | undefined,
  ) {
    const userAccount = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!userAccount) {
      throw new NotFoundException('Account not found');
    }

    const profile = await this.userProfileRepo.findOne({
      where: { accountId: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    Object.assign(profile, updateProfileDto);
    if (imageUrl) {
      profile.image = imageUrl;
    }

    const savedProfile = await this.userProfileRepo.save(profile);
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

  async deleteAccount(userId: string) {
    const userAccount = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!userAccount) {
      throw new NotFoundException('Account not found or already deleted');
    }

    userAccount.isDeleted = true;
    const deletedUser = await this.userAccountRepo.save(userAccount);

    const { ...result } = deletedUser;
    delete result.password;

    return result;
  }
}
