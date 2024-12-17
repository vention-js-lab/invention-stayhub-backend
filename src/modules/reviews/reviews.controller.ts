import { Controller, Post, Body, UseGuards, Get, Put, Param, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetAccount } from '#/shared//decorators/get-account.decorator';
import { CreateReviewDto } from './dto/request/create-review.req';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { UpdateReviewDto } from './dto/request/update-review.req';
import { UUIDValidationPipe } from '#/shared/pipes/uuid-validation.pipe';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user reviews' })
  @ApiResponse({
    status: 200,
    description: 'User reviews successfully received',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  @UseGuards(AccessTokenGuard)
  async getUserReviews(@GetAccount('accountId') accountId: string) {
    const result = await this.reviewService.getUserReviews(accountId);

    return withBaseResponse({
      status: 200,
      message: 'User reviews successfully received',
      data: result,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or failed validation.',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking or accommodation not found.',
  })
  @UseGuards(AccessTokenGuard)
  async createReview(@GetAccount('accountId') accountId: string, @Body() createReviewDto: CreateReviewDto) {
    const data = await this.reviewService.createReview(accountId, createReviewDto);

    return withBaseResponse({
      status: 201,
      message: 'Review created successfully.',
      data: data,
    });
  }

  @Put(':reviewId')
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 401, description: 'Only author can update review' })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  @UseGuards(AccessTokenGuard)
  async updateReview(
    @Param('reviewId', new UUIDValidationPipe()) reviewId: string,
    @GetAccount('accountId') accountId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const result = await this.reviewService.updateReview(accountId, reviewId, updateReviewDto);

    return withBaseResponse({
      status: 200,
      message: 'Review successfully updated',
      data: result,
    });
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: 'Deleting review' })
  @ApiOkResponse({
    description: 'Review deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Only author can delete review' })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  @UseGuards(AccessTokenGuard)
  async deleteReview(@GetAccount('accountId') accountId: string, @Param('reviewId', new UUIDValidationPipe()) reviewId: string) {
    const result = await this.reviewService.deleteReview(accountId, reviewId);

    return withBaseResponse({
      status: 204,
      message: 'Review successfully deleted',
      data: result,
    });
  }
}
