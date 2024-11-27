import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '#/modules/users/entities/account.entity';
import { Profile } from '#/modules/users/entities/profile.entity';
import { AccountRefreshToken } from '../entities/account-refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      insert: jest.fn(),
      remove: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_TOKEN_SECRET') return 'access-secret';
        if (key === 'JWT_REFRESH_TOKEN_SECRET') return 'refresh-secret';
        return null;
      }),
    };

    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked-token'),
      decode: jest
        .fn()
        .mockReturnValue({ sub: 'mock-sub', exp: Date.now() / 1000 + 3600 }),
    };

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
