import { type Review } from '#/modules/reviews/entities/review.entity';
import { faker } from '@faker-js/faker';
import { mockUser } from '#/modules/users/tests/fixtures/users-data.mock';

export const mockReviews = [
  {
    id: faker.string.uuid(),
    content: faker.lorem.text(),
    rating: faker.number.int({ min: 1, max: 5 }),
    accountId: mockUser.id,
    accommodationId: faker.string.uuid(),
    bookingId: faker.string.uuid(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
  {
    id: faker.string.uuid(),
    content: faker.lorem.text(),
    rating: faker.number.int({ min: 1, max: 5 }),
    accountId: mockUser.id,
    accommodationId: faker.string.uuid(),
    bookingId: faker.string.uuid(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
] as Review[];
