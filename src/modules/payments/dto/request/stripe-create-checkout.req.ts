import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StripeItemReqDto {
  @ApiProperty({
    description: 'Name of the item to display on the Stripe Checkout Page',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the item to show on the Stripe Checkout Page',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Payment amount in cents',
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Quantity of the item. In our case, can be left as 1',
    default: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class StripeCreateCheckoutReqDto {
  @ApiProperty({
    description: 'ID of the booking that is being paid for',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  bookingId: string;

  @ApiProperty({
    description: 'List of the items to display on the Checkout Page',
    isArray: true,
    type: StripeItemReqDto,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StripeItemReqDto)
  items: StripeItemReqDto[];
}
