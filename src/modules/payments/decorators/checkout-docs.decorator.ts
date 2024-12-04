import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CheckoutResDto } from '../dto/response/checkout.res';

export function ApiCheckoutDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new payment intent' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 201,
      description: 'Payment intent client secret retrieved successfully',
      type: CheckoutResDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid body parameters, or booking which is being paid for does not exist',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 409,
      description: 'Attempted to pay for a booking which has already been successfully paid for',
    }),
  );
}
