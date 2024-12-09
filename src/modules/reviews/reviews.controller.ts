import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetAccount } from '#/shared//decorators/get-account.decorator';
import { CreateReviewDto } from './dto/request/create-review.req';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

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
}
