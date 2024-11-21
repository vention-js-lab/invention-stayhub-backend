import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import { UserService } from '../users.service';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import {
  mockUsers,
  mockProfile,
  mockUser,
  mockUserWishlist,
  mockUpdateProfileDto,
} from './fixtures/usersMockData';
import { randomUUID } from 'node:crypto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Roles } from '../../../shared/constants/user-roles.constant';

describe('UserService', () => {
  let userService: UserService;
  let accountRepo: Repository<Account>;
  let profileRepo: Repository<Profile>;
  let wishlistRepo: Repository<Wishlist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Wishlist),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
    profileRepo = module.get<Repository<Profile>>(getRepositoryToken(Profile));
    wishlistRepo = module.get<Repository<Wishlist>>(
      getRepositoryToken(Wishlist),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('listUsers', () => {
    it('returns a list of users', async () => {
      const users = mockUsers;

      accountRepo.find = jest.fn().mockResolvedValue(users);

      const result = await userService.listUsers();

      expect(accountRepo.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'isDeleted', 'role', 'createdAt', 'updatedAt'],
      });
      expect(result).toEqual(users);
    });
  });

  describe('getProfile', () => {
    it('returns profile when account is found', async () => {
      const account = mockUser;
      const profile = mockProfile;
      const userId = mockUser.id;

      accountRepo.findOne = jest.fn().mockResolvedValue({
        ...account,
        profile,
      });

      const result = await userService.getProfile(userId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
        relations: ['profile'],
      });
      expect(result).toEqual(profile);
    });

    it('returns error if account not found', async () => {
      const userId = randomUUID();
      accountRepo.findOne = jest.fn().mockResolvedValue(null);

      const result = userService.getProfile(userId);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('returns error if profile not found', async () => {
      const account = mockUser;
      const userId = mockUser.id;

      accountRepo.findOne = jest.fn().mockResolvedValue({
        ...account,
        profile: null,
      });

      const result = userService.getProfile(userId);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserWishlist', () => {
    it('returns user wishlist', async () => {
      const account = mockUser;
      const userId = mockUser.id;
      const userWishlist = mockUserWishlist;

      accountRepo.findOne = jest.fn().mockResolvedValue(account);
      wishlistRepo.find = jest.fn().mockResolvedValue(userWishlist);

      const result = await userService.getUserWishlist(userId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
      });
      expect(wishlistRepo.find).toHaveBeenCalledWith({
        where: {
          accountId: userId,
        },
      });
      expect(result).toEqual(userWishlist);
    });

    it('returns error if account not found', async () => {
      const userId = randomUUID();
      accountRepo.findOne = jest.fn().mockResolvedValue(null);

      const result = userService.getUserWishlist(userId);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('returns updated profile', async () => {
      const account = mockUser;
      const profile = mockProfile;
      const updateProfileDto = mockUpdateProfileDto;
      const userId = mockUser.id;

      accountRepo.findOne = jest.fn().mockResolvedValue({
        ...account,
        profile,
      });
      profileRepo.save = jest.fn().mockResolvedValue({
        ...profile,
        ...updateProfileDto,
      });

      const result = await userService.updateProfile(userId, updateProfileDto);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
        relations: ['profile'],
      });
      expect(result).toEqual({
        ...profile,
        ...updateProfileDto,
      });
    });

    it('returns error if account not found', async () => {
      const userId = randomUUID();
      const updateProfileDto = mockUpdateProfileDto;
      accountRepo.findOne = jest.fn().mockResolvedValue(null);

      const result = userService.updateProfile(userId, updateProfileDto);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('returns error if profile not found', async () => {
      const account = mockUser;
      const userId = mockUser.id;
      const updateProfileDto = mockUpdateProfileDto;

      accountRepo.findOne = jest.fn().mockResolvedValue({
        ...account,
        profile: null,
      });

      const result = userService.updateProfile(userId, updateProfileDto);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfileAvatar', () => {
    it('returns updated profile', async () => {
      const account = mockUser;
      const profile = mockProfile;
      const userId = mockUser.id;
      const imageUrl = faker.internet.url();

      accountRepo.findOne = jest.fn().mockResolvedValue({
        ...account,
        profile,
      });
      profileRepo.save = jest.fn().mockResolvedValue({
        ...profile,
        image: imageUrl,
      });

      const result = await userService.updateProfileAvatar(userId, imageUrl);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
        relations: ['profile'],
      });
      expect(result).toEqual({
        ...profile,
        image: imageUrl,
      });
    });

    it('returns error if account not found', async () => {
      const userId = randomUUID();
      const imageUrl = faker.internet.url();
      accountRepo.findOne = jest.fn().mockResolvedValue(null);

      const result = userService.updateProfileAvatar(userId, imageUrl);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('returns error if profile not found', async () => {
      const account = mockUser;
      const userId = mockUser.id;
      const imageUrl = faker.internet.url();

      accountRepo.findOne = jest.fn().mockResolvedValue({
        ...account,
        profile: null,
      });

      const result = userService.updateProfileAvatar(userId, imageUrl);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleUserRole', () => {
    it('toggles user role from User to Admin', async () => {
      const userId = mockUser.id;
      const account = { ...mockUser, role: Roles.User };

      accountRepo.findOne = jest.fn().mockResolvedValue(account);
      accountRepo.save = jest
        .fn()
        .mockResolvedValue({ ...account, role: Roles.Admin });

      const result = await userService.toggleUserRole(userId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...account,
        role: Roles.Admin,
      });
      expect(result.role).toBe(Roles.Admin);
    });

    it('toggles user role from Admin to User', async () => {
      const userId = mockUser.id;
      const account = { ...mockUser, role: Roles.Admin };

      accountRepo.findOne = jest.fn().mockResolvedValue(account);
      accountRepo.save = jest
        .fn()
        .mockResolvedValue({ ...account, role: Roles.User });

      const result = await userService.toggleUserRole(userId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...account,
        role: Roles.User,
      });
      expect(result.role).toBe(Roles.User);
    });

    it('returns error if account not found', async () => {
      const userId = randomUUID();
      accountRepo.findOne = jest.fn().mockResolvedValue(null);

      const result = userService.toggleUserRole(userId);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    it('deletes user account successfully by admin', async () => {
      const deleterId = randomUUID();
      const deletingUserId = mockUser.id;
      const admin = { ...mockUser, id: deleterId, role: Roles.Admin };
      const userToDelete = { ...mockUser, isDeleted: false };

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(admin)
        .mockResolvedValueOnce(userToDelete);
      accountRepo.save = jest
        .fn()
        .mockResolvedValue({ ...userToDelete, isDeleted: true });

      const result = await userService.deleteAccount(deleterId, deletingUserId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deleterId, isDeleted: false },
      });
      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deletingUserId, isDeleted: false },
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...userToDelete,
        isDeleted: true,
      });
      expect(result.isDeleted).toBe(true);
    });

    it('deletes user account successfully by user themselves', async () => {
      const deleterId = mockUser.id;
      const deletingUserId = mockUser.id;
      const userToDelete = { ...mockUser, isDeleted: false };

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(userToDelete)
        .mockResolvedValueOnce(userToDelete);
      accountRepo.save = jest
        .fn()
        .mockResolvedValue({ ...userToDelete, isDeleted: true });

      const result = await userService.deleteAccount(deleterId, deletingUserId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deleterId, isDeleted: false },
      });
      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deletingUserId, isDeleted: false },
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...userToDelete,
        isDeleted: true,
      });
      expect(result.isDeleted).toBe(true);
    });

    it('throws forbidden exception if deleter is not admin and not the deleting user', async () => {
      const deleterId = mockUser.id;
      const deletingUserId = randomUUID();
      const userToDelete = {
        ...mockUser,
        id: deletingUserId,
        isDeleted: false,
      };
      const nonAdminUser = { ...mockUser, role: Roles.User, isDeleted: false };

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(nonAdminUser)
        .mockResolvedValueOnce(userToDelete);

      const result = userService.deleteAccount(deleterId, deletingUserId);

      await expect(result).rejects.toThrow(ForbiddenException);
    });

    it('throws not found exception if user to delete is not found', async () => {
      const deleterId = mockUser.id;
      const deletingUserId = randomUUID();
      const admin = { ...mockUser, role: Roles.Admin };

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(admin)
        .mockResolvedValueOnce(null);

      const result = userService.deleteAccount(deleterId, deletingUserId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deleterId, isDeleted: false },
      });
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
