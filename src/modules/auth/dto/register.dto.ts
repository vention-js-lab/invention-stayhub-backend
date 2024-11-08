import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The unique email address of the user',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The user password, with a length between 6 and 22 characters',
    minLength: 6,
    maxLength: 22,
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @ApiProperty({
    example: 'John',
    description:
      'The first name of the user, with a length between 3 and 20 characters',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description:
      'The last name of the user, with a length between 3 and 20 characters',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;
}
