import { SortOrder } from '#/shared/constants/sort-order.constant';
import { ParseInt } from '#/shared/transformers/parse-int.transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import { SortBy } from '../constants/sort-by.constant';
import { ApiProperty } from '@nestjs/swagger';

export class AccommodationFiltersQueryDto {
  @ApiProperty({
    description: 'Page is provided to calculate pagination',
    required: false,
    example: 1,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({
    description: 'Limit is provided to calculate pagination',
    required: false,
    example: 20,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @ApiProperty({
    description: 'Sort options to get sorted accommodations',
    required: false,
    example: 'sort_by=price',
  })
  @IsString()
  @IsEnum(SortBy)
  @IsOptional()
  sort_by?: SortBy;

  @ApiProperty({
    description:
      'Order options to clarify in which order will the accommodations be sorted',
    required: false,
    example: 'sort_order=asc',
  })
  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sort_order?: SortOrder;
}
