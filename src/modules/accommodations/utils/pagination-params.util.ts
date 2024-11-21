import { AccommodationFiltersReqQueryDto } from '#/modules/accommodations/dto/requests/accommodation-filters.req';
import { PaginationMetadata } from '#/shared/constants/pagination.constant';
export function paginationParams(filters: AccommodationFiltersReqQueryDto) {
  const paginationValues = {
    page: filters.page ? filters.page : PaginationMetadata.Page,
    limit: filters.limit ? filters.limit : PaginationMetadata.Limit,
  };
  return paginationValues;
}
