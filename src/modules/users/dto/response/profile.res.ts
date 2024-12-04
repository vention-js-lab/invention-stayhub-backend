import { ApiProperty } from '@nestjs/swagger';

export class ProfilePartialResDto {
  @ApiProperty({ example: 'John' })
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  lastName: string | null;

  @ApiProperty({ example: 'male', nullable: true })
  gender: string | null;

  @ApiProperty({ example: 'USA', nullable: true })
  country: string | null;

  @ApiProperty({ example: '+1234567890', nullable: true })
  phoneNumber: string | null;
}

export class ProfileResDto extends ProfilePartialResDto {
  @ApiProperty({ example: 'e4ea1bb8-6894-4d8b-8538-5f47419b3872' })
  id: string;

  @ApiProperty({
    example: 'http://localhost:9001/uploads/306975f7-529d-44eb-bfea-aef2deb4e933.jpg',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({ example: 'Some long text', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2024-11-25T08:52:24.555Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-25T12:21:43.715Z' })
  updatedAt: string;

  @ApiProperty({ example: '612ee44a-e29e-410c-89bc-f998d13bb8b9' })
  accountId: string;
}
