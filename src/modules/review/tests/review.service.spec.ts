import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ReviewService } from '../review.service';
import { Booking } from '../../bookings/entities/booking.entity';
import { Review } from '../entities/review.entity';
import { Accommodation } from '../../../modules/accommodations/entities/accommodations.entity';
import { BookingStatus } from '../../../shared/constants/booking-status.constant';

const mockBookingRepository = {
  findOne: jest.fn(),
};

const mockReviewRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockAccommodationRepository = {
  findOne: jest.fn(),
};

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepository,
        },
        {
          provide: getRepositoryToken(Accommodation),
          useValue: mockAccommodationRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReview', () => {
    it('should throw an error if booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReview('d4f75e3a-dd77-4b86-bab8-f1ad2cc7349c', {
          accommodationId: '99fd04ec-189f-481f-80c6-5f0d41ebcd5e',
          bookingId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(new NotFoundException('Booking not found.'));
    });

    it('should throw an error if the booking is not completed', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        id: '77806b34-dae0-4e6d-80f5-8c19f12dc276',
        accountId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
        status: BookingStatus.Pending,
      });

      await expect(
        service.createReview('d4f75e3a-dd77-4b86-bab8-f1ad2cc7349c', {
          accommodationId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
          bookingId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'You can only add a review after your booking has been completed.',
        ),
      );
    });

    it('should throw an error if the account does not match the booking account', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        id: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        accountId: '246651f3-3b4e-462b-8eeb-7da855cd2b88',
        status: BookingStatus.Completed,
      });

      await expect(
        service.createReview('246651f3-3b4e-462b-8eeb-7da855cd2b88', {
          accommodationId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
          bookingId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(new ForbiddenException('Accommodation not found.'));
    });

    it('should throw an error if a review already exists for this booking', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        id: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
        accountId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        status: BookingStatus.Completed,
      });
      mockReviewRepository.findOne.mockResolvedValue({
        id: 'existing-review-id',
      });

      await expect(
        service.createReview('9ae5e450-7c4c-4b58-b244-535f04a06325', {
          accommodationId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          bookingId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(
        new ConflictException('Review for this booking already exists.'),
      );
    });

    it('should throw an error if accommodation not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        id: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
        accountId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        status: BookingStatus.Completed,
      });
      mockReviewRepository.findOne.mockResolvedValue(null);
      mockAccommodationRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReview('9ae5e450-7c4c-4b58-b244-535f04a06325', {
          accommodationId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          bookingId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(new NotFoundException('Accommodation not found.'));
    });

    it('should create a review successfully', async () => {
      const mockReviewData = {
        content: 'Great!',
        rating: 5,
        accountId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        accommodationId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
        bookingId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
      };

      mockBookingRepository.findOne.mockResolvedValue({
        id: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
        accountId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        status: BookingStatus.Completed,
      });
      mockReviewRepository.findOne.mockResolvedValue(null);
      mockAccommodationRepository.findOne.mockResolvedValue({
        id: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
      });
      mockReviewRepository.create.mockReturnValue(mockReviewData);
      mockReviewRepository.save.mockResolvedValue(mockReviewData);

      const result = await service.createReview(
        '9ae5e450-7c4c-4b58-b244-535f04a06325',
        {
          accommodationId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          bookingId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
          rating: 5,
          content: 'Great!',
        },
      );

      expect(result).toEqual({
        status: 201,
        message: 'Review created successfully.',
        data: mockReviewData,
      });
    });
  });
});
