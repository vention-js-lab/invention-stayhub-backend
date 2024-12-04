import { BaseResponse } from '#/shared/dto/response/base-response.res';
import { ApiProperty } from '@nestjs/swagger';

class CheckoutResData {
  @ApiProperty({
    description: 'Payment intent client secret',
  })
  clientSecret: string;
}

export class CheckoutResDto extends BaseResponse<CheckoutResData> {
  @ApiProperty({
    description: 'Response data',
    type: CheckoutResData,
  })
  data: CheckoutResData;
}
