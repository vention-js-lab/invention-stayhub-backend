import { PaginationMetadata } from '#/shared/constants/pagination.constant';
export function paginationParams<T extends { page?: number; limit?: number }>(filters: T) {
  const paginationValues = {
    page: filters.page ? filters.page : PaginationMetadata.Page,
    limit: filters.limit ? filters.limit : PaginationMetadata.Limit,
  };
  return paginationValues;
}
