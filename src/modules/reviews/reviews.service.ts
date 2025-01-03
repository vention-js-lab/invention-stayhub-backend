import { UpdateReviewDto } from './dto/request/update-review.req';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/request/create-review.req';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { Accommodation } from '../accommodations/entities/accommodation.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Accommodation) private readonly accommodationRepository: Repository<Accommodation>,
  ) {}

  async getUserReviews(accountId: string) {
    const userReviews = await this.reviewRepository.find({
      where: { accountId },
    });

    return userReviews;
  }

  async createReview(accountId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    const { bookingId, rating, content } = createReviewDto;

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['accommodation'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    if (accountId !== booking.accountId) {
      throw new ForbiddenException('You can only review your own booking.');
    }

    if (booking.status !== BookingStatus.Completed) {
      throw new BadRequestException('You can only add a review after your booking has been completed.');
    }
    const accommodationId = booking.accommodationId;

    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });
    if (!accommodation) {
      throw new NotFoundException('Accommodation not found.');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { accountId, bookingId },
    });

    if (existingReview) {
      existingReview.content = content;
      existingReview.rating = rating;
      return await this.reviewRepository.save(existingReview);
    }

    const review = this.reviewRepository.create({
      content,
      rating,
      accountId,
      accommodationId,
      bookingId,
    });

    return await this.reviewRepository.save(review);
  }

  async updateReview(accountId: string, reviewId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (accountId !== review.accountId) {
      throw new ForbiddenException('Only author can update review');
    }

    if (updateReviewDto.content) {
      review.content = updateReviewDto.content;
    }
    if (updateReviewDto.rating) {
      review.rating = updateReviewDto.rating;
    }

    const savedReview = await this.reviewRepository.save(review);
    return savedReview;
  }

  async deleteReview(accountId: string, reviewId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (accountId !== review.accountId) {
      throw new ForbiddenException('Only author can delete review');
    }

    await this.reviewRepository.remove(review);
  }
}
