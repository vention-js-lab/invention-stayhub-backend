import { Body, Controller, Post, UseGuards, Headers, RawBody } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { CheckoutReqDto } from './dto/request/checkout.req';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiCheckoutDocs } from './decorators/checkout-docs.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  @ApiCheckoutDocs()
  @UseGuards(AccessTokenGuard)
  async createPaymentIntent(@GetAccount('accountId') accountId: string, @Body() checkoutReqDto: CheckoutReqDto) {
    const clientSecret = await this.stripeService.createPaymentIntent(accountId, checkoutReqDto);

    return withBaseResponse({
      status: 201,
      message: 'Checkout session created successfully',
      data: { clientSecret },
    });
  }

  @Post('webhook')
  @ApiExcludeEndpoint(true)
  async handleWebhook(@RawBody() rawBody: Buffer, @Headers('stripe-signature') signature: string) {
    await this.stripeService.handleWebhook(rawBody, signature);
  }
}
