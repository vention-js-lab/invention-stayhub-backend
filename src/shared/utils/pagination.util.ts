export function getPaginationOffset(page: number | null, limit: number | null) {
  return {
    take: limit ?? 20,
    skip: page && page > 0 ? (page - 1) * limit : 0,
  };
}

export function getPaginationMetadata(
  page: number | null,
  limit: number | null,
  total?: number | null,
) {
  return {
    page,
    hasNextPage: total - page * limit >= 0,
    hasPreviousPage: page > 1,
    total,
  };
}
