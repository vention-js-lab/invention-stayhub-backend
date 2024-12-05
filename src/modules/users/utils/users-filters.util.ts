import { type UserFiltersReqQueryDto } from '#/modules/users/dto/request/users-filters.req';
import { type Account } from '#/modules/users/entities/account.entity';
import { type SelectQueryBuilder } from 'typeorm';

export function addUserFilters(queryBuilder: SelectQueryBuilder<Account>, filters: UserFiltersReqQueryDto) {
  if (filters.search) {
    queryBuilder.andWhere('profile.firstName ILIKE :search OR profile.lastName ILIKE :search', { search: `%${filters.search}%` });
  }
  if (filters.phoneNumber) {
    queryBuilder.andWhere('profile.phoneNumber LIKE :phoneNumber', {
      phoneNumber: `%+${filters.phoneNumber}%`,
    });
  }
  if (filters.country) {
    queryBuilder.andWhere('profile.country ILIKE :country', {
      country: `%${filters.country}%`,
    });
  }
  if (filters.gender) {
    queryBuilder.andWhere('profile.gender = :gender', {
      gender: filters.gender,
    });
  }
  if (filters.role) {
    queryBuilder.andWhere('account.role = :role', {
      role: filters.role,
    });
  }
  if (filters.isDeleted !== undefined) {
    queryBuilder.andWhere(filters.isDeleted ? 'account.deleted_at IS NOT NULL' : 'account.deleted_at IS NULL');
  }
}
