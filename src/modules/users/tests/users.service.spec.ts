import { Test, type TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import { UserService } from '../users.service';
import { mockUsers, mockProfile, mockUser, mockUpdateProfileDto } from './fixtures/users-data.mock';
import { randomUUID } from 'node:crypto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Roles } from '#/shared/constants/user-roles.constant';
import { type UserFiltersReqQueryDto } from '#/modules/users/dto/requests/users-filters.req';
import { AccountType } from '#/shared/constants/user-account.constant';

describe('UserService', () => {
  let userService: UserService;
  let accountRepository: Repository<Account>;
  let profileRepository: Repository<Profile>;

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
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    profileRepository = module.get<Repository<Profile>>(getRepositoryToken(Profile));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return a list of users with filters applied', async () => {
      const users = mockUsers;
      const accountRepoBuilderSpy = jest.spyOn(accountRepository, 'createQueryBuilder');
      accountRepoBuilderSpy.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, mockUsers.length]),
      } as never);

      const result = await userService.listUsers({} as UserFiltersReqQueryDto);

      expect(accountRepoBuilderSpy).toHaveBeenCalledWith('account');
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

      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');

      accountRepositoryFindOneSpy.mockResolvedValue({
        ...account,
        profile,
      });

      const result = await userService.getProfile(userId);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
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

      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValue({
        ...account,
        profile,
      });
      profileRepository.save = jest.fn().mockResolvedValue({
        ...profile,
        ...updateProfileDto,
      });

      const result = await userService.updateProfile(userId, updateProfileDto);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
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

      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValue({
        ...account,
        profile,
      });
      profileRepository.save = jest.fn().mockResolvedValue({
        ...profile,
        image: imageUrl,
      });

      const result = await userService.updateProfileAvatar(userId, imageUrl);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
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

      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValue(account);
      const accountRepositorySaveSpy = jest.spyOn(accountRepository, 'save');
      accountRepositorySaveSpy.mockResolvedValue({ ...account, role: Roles.Admin });

      const result = await userService.toggleUserRole(userId);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(accountRepositorySaveSpy).toHaveBeenCalledWith({
        ...account,
        role: Roles.Admin,
      });
      expect(result.role).toBe(Roles.Admin);
    });

    it('toggles user role from Admin to User', async () => {
      const userId = mockUser.id;
      const account = { ...mockUser, role: Roles.Admin };

      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValue(account);
      const accountRepositorySaveSpy = jest.spyOn(accountRepository, 'save');
      accountRepositorySaveSpy.mockResolvedValue({ ...account, role: Roles.User });

      const result = await userService.toggleUserRole(userId);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(accountRepositorySaveSpy).toHaveBeenCalledWith({
        ...account,
        role: Roles.User,
      });
      expect(result.role).toBe(Roles.User);
    });

    it('returns error if account not found', async () => {
      const userId = randomUUID();
      accountRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = userService.toggleUserRole(userId);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDeleteAccount', () => {
    const mockActorId = faker.string.uuid();
    const mockAccountId = faker.string.uuid();

    const mockActor: Account = {
      accommodations: [],
      createdAt: faker.date.recent(),
      deletedAt: null,
      email: faker.internet.email(),
      googleId: null,
      id: mockActorId,
      password: faker.internet.password(),
      profile: mockProfile,
      reviews: [],
      role: Roles.Admin,
      type: AccountType.Manual,
      updatedAt: faker.date.recent(),
    };
    const mockAccount: Account = {
      accommodations: [],
      createdAt: faker.date.recent(),
      deletedAt: null,
      email: faker.internet.email(),
      googleId: null,
      id: mockAccountId,
      password: faker.internet.password(),
      profile: mockProfile,
      reviews: [],
      role: Roles.User,
      type: AccountType.Manual,
      updatedAt: faker.date.recent(),
    };

    it('throws error if actor is not found', async () => {
      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValueOnce(null);
      const softRemoveSpy = jest.spyOn(accountRepository, 'softRemove');

      const result = userService.softDeleteAccount(mockActorId, mockAccountId);
      await expect(result).rejects.toThrow(NotFoundException);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: mockActorId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(softRemoveSpy).not.toHaveBeenCalled();
    });

    it('throws error if actor is not admin', async () => {
      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValueOnce(mockAccount);
      const softRemoveSpy = jest.spyOn(accountRepository, 'softRemove');

      const result = userService.softDeleteAccount(mockActorId, mockAccountId);
      await expect(result).rejects.toThrow(ForbiddenException);

      expect(accountRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: mockActorId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenCalledTimes(1);
      expect(softRemoveSpy).not.toHaveBeenCalled();
    });

    it('throws error if account to delete is not found', async () => {
      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValueOnce(mockActor);
      accountRepositoryFindOneSpy.mockResolvedValueOnce(null);
      const softRemoveSpy = jest.spyOn(accountRepository, 'softRemove');

      const result = userService.softDeleteAccount(mockActorId, mockAccountId);
      await expect(result).rejects.toThrow(NotFoundException);

      expect(accountRepositoryFindOneSpy).toHaveBeenNthCalledWith(1, {
        where: { id: mockActorId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenNthCalledWith(2, {
        where: { id: mockAccountId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
      expect(softRemoveSpy).not.toHaveBeenCalled();
    });

    it('throws error if account to delete is admin and it is the last admin', async () => {
      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValueOnce(mockActor);
      accountRepositoryFindOneSpy.mockResolvedValueOnce({
        ...mockAccount,
        role: Roles.Admin,
      });
      const accountRepositoryCountSpy = jest.spyOn(accountRepository, 'count');
      accountRepositoryCountSpy.mockResolvedValue(1);
      const softRemoveSpy = jest.spyOn(accountRepository, 'softRemove');

      const result = userService.softDeleteAccount(mockActorId, mockAccountId);
      await expect(result).rejects.toThrow(ForbiddenException);

      expect(accountRepositoryFindOneSpy).toHaveBeenNthCalledWith(1, {
        where: { id: mockActorId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenNthCalledWith(2, {
        where: { id: mockAccountId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
      expect(accountRepositoryCountSpy).toHaveBeenCalledWith({
        where: { role: Roles.Admin },
      });
      expect(softRemoveSpy).not.toHaveBeenCalled();
    });

    it('successfully soft deletes account', async () => {
      const accountRepositoryFindOneSpy = jest.spyOn(accountRepository, 'findOne');
      accountRepositoryFindOneSpy.mockResolvedValueOnce(mockActor);
      accountRepositoryFindOneSpy.mockResolvedValueOnce(mockAccount);
      accountRepository.softRemove = jest.fn();
      const accountRepositoryCountSpy = jest.spyOn(accountRepository, 'count');
      accountRepositoryCountSpy.mockResolvedValue(2);
      const softRemoveSpy = jest.spyOn(accountRepository, 'softRemove');

      const result = userService.softDeleteAccount(mockActorId, mockAccountId);
      await expect(result).resolves.not.toThrow();

      expect(accountRepositoryFindOneSpy).toHaveBeenNthCalledWith(1, {
        where: { id: mockActorId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenNthCalledWith(2, {
        where: { id: mockAccountId },
      });
      expect(accountRepositoryFindOneSpy).toHaveBeenCalledTimes(2);
      expect(accountRepositoryCountSpy).not.toHaveBeenCalled();
      expect(softRemoveSpy).toHaveBeenCalledWith(mockAccount);
    });
  });
});
