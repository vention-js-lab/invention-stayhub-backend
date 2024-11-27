import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  RawBody,
} from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { StripeCreateCheckoutReqDto } from '../dto/request/stripe-create-checkout.req';
import { GetAccount } from '#/modules/auth/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StripeCreateCheckoutResDto } from '../dto/response/stripe-create-checkout.res';

@ApiTags('payments')
@Controller('payments/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Create a new stripe checkout session' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Checkout session URL retrieved successfully',
    type: StripeCreateCheckoutResDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid body parameters, or booking which is being paid for does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: `Attempted to pay for someone else's booking`,
  })
  @ApiResponse({
    status: 409,
    description:
      'Attempted to pay for a booking which has already been successfully paid for',
  })
  @UseGuards(AccessTokenGuard)
  async createCheckoutSession(
    @GetAccount('accountId') accountId: string,
    @Body() stripeCreateCheckoutReqDto: StripeCreateCheckoutReqDto,
  ) {
    const checkoutUrl = await this.stripeService.createCheckoutSession(
      accountId,
      stripeCreateCheckoutReqDto,
    );

    return withBaseResponse({
      status: 200,
      message: 'Checkout session created successfully',
      data: { checkoutUrl },
    });
  }

  @Post('webhook')
  @ApiExcludeEndpoint(true)
  async handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    this.stripeService.handleWebhook(rawBody, signature);
  }
}
