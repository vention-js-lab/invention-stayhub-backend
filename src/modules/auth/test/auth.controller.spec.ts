import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '#/modules/users/entities/account.entity';
import { Profile } from '#/modules/users/entities/profile.entity';
import { AccountRefreshToken } from '../entities/account-refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      insert: jest.fn(),
      remove: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'JWT_ACCESS_TOKEN_SECRET':
            return 'mock-access-token-secret';
          case 'JWT_REFRESH_TOKEN_SECRET':
            return 'mock-refresh-token-secret';
          case 'JWT_ACCESS_TOKEN_EXPIRY':
            return '3600s';
          case 'JWT_REFRESH_TOKEN_EXPIRY':
            return '7d';
          default:
            return null;
        }
      }),
    };

    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked-token'),
      decode: jest
        .fn()
        .mockReturnValue({ sub: 'mock-sub', exp: Date.now() / 1000 + 3600 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AccountRefreshToken),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
