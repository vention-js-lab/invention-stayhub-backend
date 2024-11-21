import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { Account } from '#/modules/users/entities/account.entity';
import { Profile } from '#/modules/users/entities/profile.entity';
import { Gender } from '#/shared/constants/gender.constant';
import { Roles } from '#/shared/constants/user-roles.constant';
import { UpdateProfileDto } from '#/modules/users/dto/requests/update-profile.dto';
import { faker } from '@faker-js/faker';

export const mockUsers = [
  {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    isDeleted: faker.datatype.boolean(),
    role: faker.helpers.arrayElement([Roles.User, Roles.Admin]),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
  {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    isDeleted: faker.datatype.boolean(),
    role: faker.helpers.arrayElement([Roles.User, Roles.Admin]),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
] as Account[];

export const mockUser = mockUsers[0];

export const mockProfile: Profile = {
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  image: faker.internet.url(),
  gender: faker.helpers.arrayElement([Gender.Female, Gender.Male]),
  country: faker.location.country(),
  description: faker.food.description(),
  phoneNumber: faker.phone.number(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  accountId: mockUser,
};

export const mockUserWishlist = [
  {
    id: faker.string.uuid(),
    accountId: mockUser.id,
    accommodationId: faker.string.uuid(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
  {
    id: faker.string.uuid(),
    accountId: mockUser.id,
    accomodationId: faker.string.uuid(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  },
] as Wishlist[];

export const mockUpdateProfileDto: UpdateProfileDto = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  gender: faker.helpers.arrayElement([Gender.Female, Gender.Male]),
  country: faker.location.country(),
  description: faker.food.description(),
  phoneNumber: faker.phone.number(),
};
