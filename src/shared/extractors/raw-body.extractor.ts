import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

export function extractRequestRawBody(request: RawBodyRequest<Request>) {
  return request.rawBody;
}
