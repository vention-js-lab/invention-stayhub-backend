import { PaginationMetadata } from '../constants/pagination.constant';
import { PaginationValues } from '../types/pagination.type';

export function getPaginationOffset(page: number, limit: number) {
  return {
    take: limit ?? PaginationMetadata.Limit,
    skip: page && page > 0 ? (page - 1) * limit : 0,
  };
}

export function getPaginationMetadata({
  page,
  limit,
  total,
}: PaginationValues) {
  return {
    page,
    hasNextPage: total - page * limit >= 0,
    hasPreviousPage: page > 1,
    total,
  };
}
