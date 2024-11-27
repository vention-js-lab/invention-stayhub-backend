import { BaseResponse } from '#/shared/dto/response/base-response.res';
import { ApiProperty } from '@nestjs/swagger';

class StripeCreateCheckoutResData {
  @ApiProperty({
    description: 'Stripe checkout page URL',
  })
  url: string;
}

export class StripeCreateCheckoutResDto extends BaseResponse {
  @ApiProperty({
    description: 'Response data',
    type: StripeCreateCheckoutResData,
  })
  data: StripeCreateCheckoutResData;
}
