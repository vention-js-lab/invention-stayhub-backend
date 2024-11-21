import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Account) private userAccountRepo: Repository<Account>,
    @InjectRepository(Profile) private userProfileRepo: Repository<Profile>,
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
      throw new NotFoundException('Account not found or deleted');
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

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const userAccount = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!userAccount) {
      throw new NotFoundException('Account not found or deleted');
    }

    const profile = await this.userProfileRepo.findOne({
      where: { accountId: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    Object.assign(profile, updateProfileDto);

    const savedProfile = await this.userProfileRepo.save(profile);
    return savedProfile;
  }

  async deleteAccountByOwner(userId: string) {
    const userAccount = await this.userAccountRepo.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!userAccount) {
      throw new NotFoundException('Account not found or already deleted.');
    }

    userAccount.isDeleted = true;
    const deletedUser = await this.userAccountRepo.save(userAccount);

    return deletedUser;
  }
}
