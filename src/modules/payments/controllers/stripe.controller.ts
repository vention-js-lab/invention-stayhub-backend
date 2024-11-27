import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  RawBody,
} from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { StripeItemsListReqDto } from '../dto/request/stripe-items.req';
import { GetAccount } from '#/modules/auth/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@Controller('payments/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  @UseGuards(AccessTokenGuard)
  async createCheckout(
    @GetAccount('accountId') accountId: string,
    @Body() stripeItemsListReqDto: StripeItemsListReqDto,
  ) {
    const checkoutUrl = await this.stripeService.createCheckoutSession(
      accountId,
      stripeItemsListReqDto,
    );

    return withBaseResponse({
      status: 200,
      message: 'Checkout session created successfully',
      data: { checkoutUrl },
    });
  }

  @Post('webhook')
  async handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    this.stripeService.handleWebhook(rawBody, signature);
  }
}
