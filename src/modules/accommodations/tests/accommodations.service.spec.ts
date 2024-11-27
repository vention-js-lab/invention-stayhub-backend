import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationService } from '../services/accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { NotFoundException } from '@nestjs/common';
import { AccommodationAddressService } from '../services/accommodation-address.service';
import { AccommodationAmenityService } from '../services/accommodation-amenity.service';
import { AccommodationImageService } from '../services/accommodation-image.service';

const mockAccommodationRepository = {
  createQueryBuilder: jest.fn(),
};

const mockAccommodationAddressService = {
  create: jest.fn(),
  update: jest.fn(),
};
const mockAccommodationAmenityService = {
  create: jest.fn(),
  update: jest.fn(),
};
const mockAccommodationImageService = { create: jest.fn(), update: jest.fn() };

describe('AccommodationService', () => {
  let service: AccommodationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationService,
        {
          provide: getRepositoryToken(Accommodation),
          useValue: mockAccommodationRepository,
        },
        {
          provide: AccommodationAddressService,
          useValue: mockAccommodationAddressService,
        },
        {
          provide: AccommodationAmenityService,
          useValue: mockAccommodationAmenityService,
        },
        {
          provide: AccommodationImageService,
          useValue: mockAccommodationImageService,
        },
      ],
    }).compile();

    service = module.get<AccommodationService>(AccommodationService);
  });

  describe('getAccommodationById', () => {
    it('should return accommodation with reviews and user details', async () => {
      const mockAccommodation = {
        id: 'accommodation-id',
        name: 'Test Accommodation',
        address: { city: 'Test City' },
        amenity: { wifi: true },
        images: [{ url: 'image-url' }],
        reviews: [
          {
            id: 'review-id',
            content: 'Great place!',
            rating: 5,
            account: {
              id: 'user-id',
              profile: { firstName: 'John', lastName: 'Doe' },
            },
          },
        ],
      };

      mockAccommodationRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockAccommodation),
      });

      const result = await service.getAccommodationById('accommodation-id');

      expect(result).toEqual({
        ...mockAccommodation,
        reviews: [
          {
            id: 'review-id',
            content: 'Great place!',
            rating: 5,
            user: {
              id: 'user-id',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        ],
      });

      expect(mockAccommodationRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw NotFoundException if accommodation is not found', async () => {
      mockAccommodationRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getAccommodationById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockAccommodationRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
