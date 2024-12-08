import { Body, Controller, Post, UseGuards, Headers, RawBody } from '@nestjs/common';
import { CheckoutService } from './services/checkout.service';
import { StripeService } from './services/stripe.service';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiCheckoutDocs } from './decorators/checkout-docs.decorator';
import { UUIDValidationPipe } from '#/shared/pipes/uuid-validation.pipe';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('checkout')
  @ApiCheckoutDocs()
  @UseGuards(AccessTokenGuard)
  async createPaymentIntent(
    @Body('bookingId', new UUIDValidationPipe()) bookingId: string,
    @GetAccount('accountId') accountId: string,
  ) {
    const result = await this.checkoutService.createCheckoutSession(bookingId, accountId);

    return withBaseResponse({
      status: 201,
      message: 'Checkout session created successfully',
      data: result,
    });
  }

  @Post('stripe-webhook')
  @ApiExcludeEndpoint(true)
  async handleWebhook(@RawBody() rawBody: Buffer, @Headers('stripe-signature') signature: string) {
    await this.stripeService.handleWebhook(rawBody, signature);
  }
}
