import { BaseResponse } from '../types/base-response.type';

export function withBaseResponse<T>({
  status,
  message,
  data,
}: {
  status: number;
  message: string;
  data: T;
}): BaseResponse<T> {
  return {
    status,
    message,
    data,
  };
}
