import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetAccount } from '../auth/decorators/get-account.decorator';
import { CreateReviewDto } from './dto/create.review.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
  async createReview(
    @GetAccount('accountId') accountId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const data = await this.reviewService.createReview(
      accountId,
      createReviewDto,
    );

    return withBaseResponse({
      status: 201,
      message: 'Review created successfully.',
      data: data,
    });
  }
}
