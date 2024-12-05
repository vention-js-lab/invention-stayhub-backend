import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty({
    description: 'HTTP status code',
  })
  status: number;

  @ApiProperty({
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: T;
}
