import { IsOptional, IsString, IsEnum, IsPhoneNumber } from 'class-validator';
import { Gender } from '#/shared/constants/gender.constant';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName: string | undefined;

  @IsOptional()
  @IsString()
  lastName: string | undefined;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender | undefined;

  @IsOptional()
  @IsString()
  country: string | undefined;

  @IsOptional()
  @IsString()
  description: string | undefined;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string | undefined;
}
