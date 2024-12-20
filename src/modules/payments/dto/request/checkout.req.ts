import { IsNumber, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutReqDto {
  @ApiProperty({
    description: 'ID of the booking that is being paid for',
    format: 'uuid',
  })
  @IsUUID()
  bookingId: string;

  @ApiProperty({
    description: 'Payment amount in cents',
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
