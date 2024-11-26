import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import { UserService } from '../users.service';
import {
  mockUsers,
  mockProfile,
  mockUser,
  mockUpdateProfileDto,
} from './fixtures/users-data.mock';
import { randomUUID } from 'node:crypto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Roles } from '#/shared/constants/user-roles.constant';
import { UserFiltersReqQueryDto } from '#/modules/users/dto/requests/users-filters.req';

describe('UserService', () => {
  let userService: UserService;
  let accountRepo: Repository<Account>;
  let profileRepo: Repository<Profile>;

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
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
    profileRepo = module.get<Repository<Profile>>(getRepositoryToken(Profile));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return a list of users with filters applied', async () => {
      const users = mockUsers;
      accountRepo.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockUsers, mockUsers.length]),
      });

      const result = await userService.listUsers({} as UserFiltersReqQueryDto);

      expect(accountRepo.createQueryBuilder).toHaveBeenCalledWith('account');
      expect(result).toEqual({
        result: users,
        metadata: {
          page: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          total: users.length,
        },
      });
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
  });

  describe('updateProfileAvatar', () => {
    it('returns updated profile (avatar)', async () => {
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

  describe('softDeleteAccount', () => {
    it('deletes user account successfully by admin', async () => {
      const deleteActorId = randomUUID();
      const deletingUserId = mockUser.id;
      const admin = {
        ...mockUser,
        id: deleteActorId,
        role: Roles.Admin,
      };
      const userToDelete = mockUser;

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(admin)
        .mockResolvedValueOnce(userToDelete);
      accountRepo.save = jest.fn().mockResolvedValue({
        ...userToDelete,
        isDeleted: true,
      });
      accountRepo.softRemove = jest.fn().mockResolvedValue({
        ...userToDelete,
        isDeleted: true,
        deletedAt: Date.now(),
      });

      await userService.softDeleteAccount(deleteActorId, deletingUserId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deleteActorId, isDeleted: false },
      });
      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deletingUserId, isDeleted: false },
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...userToDelete,
        isDeleted: true,
      });
      expect(accountRepo.softRemove).toHaveBeenCalledWith(userToDelete);
    });

    it('deletes user account successfully by user themselves', async () => {
      const deleteActorId = mockUser.id;
      const deletingUserId = mockUser.id;
      const userToDelete = { ...mockUser, role: Roles.User };

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(userToDelete)
        .mockResolvedValueOnce(userToDelete);
      accountRepo.save = jest.fn().mockResolvedValue({
        ...userToDelete,
        isDeleted: true,
      });
      accountRepo.softRemove = jest.fn().mockResolvedValue({
        ...userToDelete,
        isDeleted: true,
        deletedAt: Date.now(),
      });

      await userService.softDeleteAccount(deleteActorId, deletingUserId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deleteActorId, isDeleted: false },
      });
      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deletingUserId, isDeleted: false },
      });
      expect(accountRepo.save).toHaveBeenCalledWith({
        ...userToDelete,
        isDeleted: true,
      });
      expect(accountRepo.softRemove).toHaveBeenCalledWith(userToDelete);
    });

    it('throws forbidden exception if deleteActor is not admin and not the deleting user', async () => {
      const deleteActorId = mockUser.id;
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

      const result = userService.softDeleteAccount(
        deleteActorId,
        deletingUserId,
      );

      await expect(result).rejects.toThrow(ForbiddenException);
    });

    it('throws not found exception if deleting user is not found', async () => {
      const deleterId = mockUser.id;
      const deletingUserId = randomUUID();
      const admin = { ...mockUser, role: Roles.Admin };

      accountRepo.findOne = jest
        .fn()
        .mockResolvedValueOnce(admin)
        .mockResolvedValueOnce(null);

      const result = userService.softDeleteAccount(deleterId, deletingUserId);

      expect(accountRepo.findOne).toHaveBeenCalledWith({
        where: { id: deleterId, isDeleted: false },
      });
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
