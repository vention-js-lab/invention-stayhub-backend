import { type Request } from 'express';

export function extractRequestBody<T>(request: Request): T {
  return request.body as T;
}
