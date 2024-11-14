import { SortOrder } from '#/shared/constants/sort-order.constant';
import { SortBy } from '../constants/sort-by.constant';
import { AccommodationFiltersQueryDto } from '../dto/accommodation-filters.dto';

export function sortByParams(searchParams: AccommodationFiltersQueryDto) {
  const sortBy = searchParams.sort_by ?? SortBy.CreatedAt;
  const sortOrder = searchParams.sort_order ?? SortOrder.Desc;
  const orderBy = {
    [sortBy]: sortOrder,
  };
  return orderBy;
}
