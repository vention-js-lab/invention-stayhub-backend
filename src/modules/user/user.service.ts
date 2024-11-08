import { UpdateProfileDto } from './dto/requests/update-profile.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!users) {
      throw new NotFoundException('Users are empty');
    }

    return users;
  }

  async getProfile(userId: string) {
    const profile = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email is already in use');
      }
      user.email = updateProfileDto.email;
    }
    if (updateProfileDto.firstName) {
      user.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName) {
      user.lastName = updateProfileDto.lastName;
    }

    const updatedProfile = await this.userRepository.save(user);
    return updatedProfile;
  }

  async deleteUserById(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = await this.userRepository.delete({ id: userId });

    if (deletedUser.affected) {
      return user;
    } else {
      throw new NotFoundException('User could not be deleted');
    }
  }
}
