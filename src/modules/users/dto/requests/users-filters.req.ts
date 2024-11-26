import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import { TransformToBoolean } from '#/shared/transformers/transform-type.transformer';
import { Roles } from '#/shared/constants/user-roles.constant';
import { ParseInt } from '#/shared/transformers/parse-int.transformer';
import { Gender } from '#/shared/constants/gender.constant';

export class UserFiltersReqQueryDto {
  @ApiProperty({
    description: 'Page is provided to calculate pagination',
    required: false,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number | undefined;

  @ApiProperty({
    description: 'Limit is provided to calculate pagination',
    required: false,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit: number | undefined;

  @ApiProperty({
    description: 'Search by first name, last name, phone number',
    required: false,
    type: String,
    format: 'email',
  })
  @IsOptional()
  @IsString()
  search: string | undefined;

  @ApiProperty({
    description: 'User country',
    required: false,
    type: String,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  country: string | undefined;

  @ApiProperty({
    description: 'Filter by gender',
    required: false,
    example: 'male',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender: Gender | undefined;

  @ApiProperty({
    description: 'Filter by user deleted status',
    required: false,
    type: Boolean,
    format: 'boolean',
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isDeleted: boolean | undefined;

  @ApiProperty({
    description: 'Filter by roles',
    required: false,
    example: 'user',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Roles)
  role: Roles | undefined;
}
