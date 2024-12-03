import { type PaginationValues } from '../types/pagination.type';

export function getPaginationOffset(page: number, limit: number) {
  return {
    take: limit,
    skip: (page - 1) * limit,
  };
}

export function getPaginationMetadata({ page, limit, total }: PaginationValues) {
  return {
    page,
    hasNextPage: total - page * limit >= 0,
    hasPreviousPage: page > 1,
    total,
  };
}
