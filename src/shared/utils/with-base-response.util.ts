import { type BaseResponse } from '../types/base-response.type';

export function withBaseResponse<T>({ status, message, data }: BaseResponse<T>): BaseResponse<T> {
  return {
    status,
    message,
    data,
  };
}
