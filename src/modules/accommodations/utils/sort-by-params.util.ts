import { SortOrder } from '#/shared/constants/sort-order.constant';
import { SortBy } from '../constants/sort-by.constant';
import { type AccommodationFiltersReqQueryDto } from '../dto/requests/accommodation-filters.req';

export function sortByParams(searchParams: AccommodationFiltersReqQueryDto) {
  const sortBy = searchParams.sortBy ?? SortBy.CreatedAt;
  const sortOrder = searchParams.sortOrder ?? SortOrder.Desc;
  const orderBy = {
    [sortBy]: sortOrder,
  };
  return orderBy;
}
