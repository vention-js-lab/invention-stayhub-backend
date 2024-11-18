import { HttpStatus, ParseUUIDPipe } from '@nestjs/common';

export class UUIDValidationPipe extends ParseUUIDPipe {
  constructor() {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4',
    });
  }
}
