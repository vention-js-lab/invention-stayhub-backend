import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    format: 'email',
    description: 'The unique email address of the user',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password, with a length between 6 and 22 characters',
    minLength: 6,
    maxLength: 22,
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;
}
