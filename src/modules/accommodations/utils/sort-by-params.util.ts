import { SortOrder } from '#/shared/constants/sort-order.constant';
import { SortBy } from '../constants/sort-by.constant';
import { AccommodationFiltersQueryDto } from '../dto/requests/accommodation-filters.dto';

export function sortByParams(searchParams: AccommodationFiltersQueryDto) {
  const sortBy = searchParams.sortBy ?? SortBy.CreatedAt;
  const sortOrder = searchParams.sortOrder ?? SortOrder.Desc;
  const orderBy = {
    [sortBy]: sortOrder,
  };
  return orderBy;
}
