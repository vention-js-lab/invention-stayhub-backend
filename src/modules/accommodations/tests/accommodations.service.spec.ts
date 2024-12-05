import { Test, type TestingModule } from '@nestjs/testing';
import { AccommodationsService } from '../services/accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodation.entity';
import { NotFoundException } from '@nestjs/common';
import { AccommodationAddressService } from '../services/accommodation-address.service';
import { AccommodationAmenityService } from '../services/accommodation-amenity.service';
import { AccommodationImageService } from '../services/accommodation-image.service';
import { time } from '#/shared/libs/time.lib';
import { TimeFormat } from '#/shared/constants/time.constant';

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

describe('AccommodationsService', () => {
  let service: AccommodationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationsService,
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

    service = module.get<AccommodationsService>(AccommodationsService);
  });

  describe('getAccommodationById', () => {
    it('should return accommodation with bookings and reviews', async () => {
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
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-02T12:00:00Z',
            account: {
              id: 'user-id',
              profile: {
                firstName: 'John',
                lastName: 'Doe',
                country: 'USA',
                image: 'user-image-url',
                createdAt: '2024-01-01T09:00:00Z',
              },
            },
          },
        ],
        bookings: [
          {
            startDate: '2024-12-01',
            endDate: '2024-12-10',
            status: 'Pending',
          },
          {
            startDate: '2024-12-15',
            endDate: '2024-12-20',
            status: 'Confirmed',
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
        bookings: [
          {
            startDate: time('2024-12-01').format(TimeFormat.Calendar),
            endDate: time('2024-12-10').format(TimeFormat.Calendar),
            status: 'Pending',
          },
          {
            startDate: time('2024-12-15').format(TimeFormat.Calendar),
            endDate: time('2024-12-20').format(TimeFormat.Calendar),
            status: 'Confirmed',
          },
        ],
        reviews: [
          {
            id: 'review-id',
            content: 'Great place!',
            rating: 5,
            createdAt: time('2024-01-01T10:00:00Z').format(TimeFormat.CalendarWithTime),
            updatedAt: time('2024-01-02T12:00:00Z').format(TimeFormat.CalendarWithTime),
            user: {
              id: 'user-id',
              firstName: 'John',
              lastName: 'Doe',
              country: 'USA',
              photo: 'user-image-url',
              createdAt: time('2024-01-01T09:00:00Z').format(TimeFormat.CalendarWithTime),
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

      await expect(service.getAccommodationById('invalid-id')).rejects.toThrow(NotFoundException);

      expect(mockAccommodationRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
