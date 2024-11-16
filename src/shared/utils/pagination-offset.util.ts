export function getPaginationOffset(page: number | null, limit: number | null) {
  return {
    take: limit ?? 20,
    skip: page && page > 0 ? (page - 1) * limit : 0,
  };
}
