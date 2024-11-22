import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetAccount } from '../auth/decorators/get-account.decorator';
import { CreateReviewDto } from './dto/create.review.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../shared/guards/access-token.guard';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/add')
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
  createReview(
    @GetAccount('accountId') accountId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(accountId, createReviewDto);
  }
}
