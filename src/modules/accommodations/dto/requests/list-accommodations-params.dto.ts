import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import { SortOrder } from '#/shared/constants/sort-order.constants';
import { ParseInt } from '#/shared/transformers/parse-int.transformers';

export class ListAccommodationsParamsDto {
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sortByPrice?: SortOrder;

  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sortByNumberOfRooms?: SortOrder;

  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sortByNumberOfPeople?: SortOrder;

  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sortByCreatedAt?: SortOrder;

  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;
}
