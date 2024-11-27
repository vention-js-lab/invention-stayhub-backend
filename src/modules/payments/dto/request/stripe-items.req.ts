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

export class StripeItemReqDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class StripeItemsListReqDto {
  @IsString()
  @IsUUID()
  bookingId: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StripeItemReqDto)
  items: StripeItemReqDto[];
}
