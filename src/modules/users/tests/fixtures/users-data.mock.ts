import { Account } from '#/modules/users/entities/account.entity';
import { Profile } from '#/modules/users/entities/profile.entity';
import { Gender } from '#/shared/constants/gender.constant';
import { Roles } from '#/shared/constants/user-roles.constant';
import { UpdateProfileDto } from '#/modules/users/dto/requests/update-profile.req';
import { faker } from '@faker-js/faker';

export const mockUsers = [
  {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement([Roles.User, Roles.Admin]),
    createdAt: faker.date.anytime(),
    deletedAt: null,
    profile: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.arrayElement([Gender.Female, Gender.Male]),
      country: faker.location.country(),
      phoneNumber: faker.phone.number(),
    },
  },
  {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement([Roles.User, Roles.Admin]),
    createdAt: faker.date.anytime(),
    deletedAt: null,
    profile: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.arrayElement([Gender.Female, Gender.Male]),
      country: faker.location.country(),
      phoneNumber: faker.phone.number(),
    },
  },
] as Account[];

export const mockUser = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement([Roles.User, Roles.Admin]),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  deletedAt: null,
} as Account;

export const mockProfile = {
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
  accountId: mockUser.id,
} as Profile;

export const mockUpdateProfileDto: UpdateProfileDto = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  gender: faker.helpers.arrayElement([Gender.Female, Gender.Male]),
  country: faker.location.country(),
  description: faker.food.description(),
  phoneNumber: faker.phone.number(),
};
