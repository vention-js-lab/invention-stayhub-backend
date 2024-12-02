import { faker } from '@faker-js/faker';
import { type Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { type Accommodation } from '#/modules/accommodations/entities/accommodations.entity';

export const mockUserId = faker.string.uuid();

export const mockAccommodation = {
  id: faker.string.uuid(),
  name: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  coverImage: faker.internet.url(),
  price: faker.number.float(),
  available: faker.datatype.boolean(),
  availableFrom: faker.date.future(),
  availableTo: faker.date.future(),
  squareMeters: faker.number.int({ min: 20, max: 200 }),
  numberOfRooms: faker.number.int({ min: 1, max: 5 }),
  allowedNumberOfPeople: faker.number.int({ min: 1, max: 10 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ownerId: faker.string.uuid(),
  deletedAt: null,
} as Accommodation;

export const mockWishlist = [
  {
    id: faker.string.uuid(),
    accountId: mockUserId,
    accommodationId: mockAccommodation.id,
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
  {
    id: faker.string.uuid(),
    accountId: mockUserId,
    accomodationId: faker.string.uuid(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
] as Wishlist[];

export const mockWishlistItem = {
  id: faker.string.uuid(),
  accountId: mockUserId,
  accommodationId: mockAccommodation.id,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
} as Wishlist;
