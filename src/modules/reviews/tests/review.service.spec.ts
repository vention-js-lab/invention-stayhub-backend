import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { Booking } from '#/modules/bookings/entities/booking.entity';
import { Review } from '../entities/review.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { mockReviews } from './fixtures/reviews-data.mock';
import { mockUser } from '#/modules/users/tests/fixtures/users-data.mock';

const mockBookingRepository = {
  findOne: jest.fn(),
};

const mockReviewRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockAccommodationRepository = {
  findOne: jest.fn(),
};

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
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

    service = module.get<ReviewsService>(ReviewsService);
  });

  describe('getUserReviews', () => {
    it('gets all reviews of user', async () => {
      mockReviewRepository.find.mockResolvedValue(mockReviews);

      const result = await service.getUserReviews(mockUser.id);

      expect(mockReviewRepository.find).toHaveBeenCalledWith({ where: { accountId: mockUser.id } });
      expect(result).toEqual(mockReviews);
    });
  });

  describe('createReview', () => {
    it('should throw an error if booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReview('d4f75e3a-dd77-4b86-bab8-f1ad2cc7349c', {
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
          bookingId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(new BadRequestException('You can only add a review after your booking has been completed.'));
    });

    it('should throw an error if the account does not match the booking account', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        id: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        accountId: '246651f3-3b4e-462b-8eeb-7da855cd2b88',
        status: BookingStatus.Completed,
      });

      await expect(
        service.createReview('246651f3-3b4e-462b-8eeb-7da855cd2b88', {
          bookingId: 'd4f75e3a-dd77-4b86-bab8-f1ad2cc7349c',
          rating: 5,
          content: 'Great!',
        }),
      ).rejects.toThrow(new ForbiddenException('Accommodation not found.'));
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

      const result = await service.createReview('9ae5e450-7c4c-4b58-b244-535f04a06325', {
        bookingId: '9ae5e450-7c4c-4b58-b244-535f04a06325',
        rating: 5,
        content: 'Great!',
      });

      expect(result).toEqual(mockReviewData);
    });
  });

  describe('updateReview', () => {
    it('updates users review', async () => {
      const review = { ...mockReviews[0], id: 'review-id' };
      const accountId = mockUser.id;

      mockReviewRepository.findOne.mockResolvedValue(review);
      mockReviewRepository.save.mockResolvedValue({ ...review, content: 'Updated content', rating: 4 });

      const result = await service.updateReview(accountId, review.id, { content: 'Updated content', rating: 4 });

      expect(mockReviewRepository.findOne).toHaveBeenCalledWith({ where: { id: 'review-id' } });
      expect(mockReviewRepository.save).toHaveBeenCalledWith({ ...review, content: 'Updated content', rating: 4 });
      expect(result).toEqual({ ...review, content: 'Updated content', rating: 4 });
    });

    it('throws NotFoundException if review does not exist', async () => {
      mockReviewRepository.findOne.mockResolvedValue(null);

      await expect(service.updateReview('user-id', 'review-id', { content: 'Updated content', rating: 4 })).rejects.toThrow(
        new NotFoundException('Review not found'),
      );
      expect(mockReviewRepository.findOne).toHaveBeenCalledWith({ where: { id: 'review-id' } });
    });

    it('throws ForbiddenException if account does not match review owner', async () => {
      mockReviewRepository.findOne.mockResolvedValue({
        id: 'review-id',
        accountId: 'user-id',
      });

      await expect(
        service.updateReview('another-user-id', 'review-id', { content: 'Updated content', rating: 4 }),
      ).rejects.toThrow(new ForbiddenException('Only author can update review'));
    });
  });

  describe('deleteReview', () => {
    it('deletes users review', async () => {
      const review = { ...mockReviews[0], id: 'review-id' };
      const accountId = mockUser.id;

      mockReviewRepository.findOne.mockResolvedValue(review);
      mockReviewRepository.remove.mockResolvedValue(review);

      await service.deleteReview(accountId, 'review-id');

      expect(mockReviewRepository.findOne).toHaveBeenCalledWith({ where: { id: 'review-id' } });
      expect(mockReviewRepository.remove).toHaveBeenCalledWith(review);
    });

    it('throws NotFoundException if review does not exist', async () => {
      mockReviewRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteReview('user-id', 'review-id')).rejects.toThrow(new NotFoundException('Review not found'));
      expect(mockReviewRepository.findOne).toHaveBeenCalledWith({ where: { id: 'review-id' } });
    });

    it('throws ForbiddenException if account does not match review owner', async () => {
      mockReviewRepository.findOne.mockResolvedValue({
        id: 'review-id',
        accountId: 'user-id',
      });

      await expect(service.deleteReview('another-user-id', 'review-id')).rejects.toThrow(
        new ForbiddenException('Only author can delete review'),
      );
    });
  });
});
