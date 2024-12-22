/* eslint-disable no-console */
import * as fs from 'fs';
import { DataSource, type DeepPartial } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Account } from './src/modules/users/entities/account.entity';
import { Profile } from './src/modules/users/entities/profile.entity';
import { Review } from './src/modules/reviews/entities/review.entity';
import { Booking } from './src/modules/bookings/entities/booking.entity';
import { Accommodation } from './src/modules/accommodations/entities/accommodation.entity';
import { AccommodationImage } from './src/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationAddress } from './src/modules/accommodations/entities/accommodation-address.entity';
import { AccommodationAmenity } from './src/modules/accommodations/entities/accommodation-amenity.entity';
import { Wishlist } from './src/modules/wishlists/entities/wishlist.entity';
import { Category } from './src/modules/categories/entities/categories.entity';

config({ path: resolve(__dirname, '.env') });

const DataSourceConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['./database/migrations/*'],
  synchronize: false,
  migrationsTableName: 'migrations',
  uuidExtension: 'uuid-ossp',
  entities: [
    Accommodation,
    Account,
    Profile,
    Review,
    Booking,
    AccommodationImage,
    AccommodationAddress,
    AccommodationAmenity,
    Wishlist,
    Category,
  ],
});

export default async function seed(dataSource: DataSource) {
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    const accountRepository = dataSource.getRepository(Account);
    const profileRepository = dataSource.getRepository(Profile);
    const accommodationRepository = dataSource.getRepository(Accommodation);
    const bookingsRepository = dataSource.getRepository(Booking);
    const addressRepository = dataSource.getRepository(AccommodationAddress);
    const amenityRepository = dataSource.getRepository(AccommodationAmenity);
    const reviewsRepository = dataSource.getRepository(Review);
    const imageRepository = dataSource.getRepository(AccommodationImage);
    const categoryRepository = dataSource.getRepository(Category);
    const usersData: DeepPartial<Account>[] = JSON.parse(fs.readFileSync('./src/seeds/users.json', { encoding: 'utf-8' }));
    const categoriesData: DeepPartial<Category>[] = JSON.parse(
      fs.readFileSync('./src/seeds/categories.json', { encoding: 'utf-8' }),
    );
    const accommodationData: DeepPartial<Accommodation>[] = JSON.parse(
      fs.readFileSync('./src/seeds/accommodations.json', { encoding: 'utf-8' }),
    );

    const users = usersData.map(async (item) => {
      try {
        const user = accountRepository.create(item);
        await accountRepository.save(user);

        if (item.profile) {
          const profile = profileRepository.create(item.profile);
          await profileRepository.save(profile);
        }
      } catch (error) {
        console.error(`Failed to save users: ${item.id}`, error);
        throw error;
      }
    });

    await Promise.all(users);

    const categories = categoriesData.map(async (item) => {
      try {
        const category = categoryRepository.create(item);
        await categoryRepository.save(category);
      } catch (error) {
        console.error(`Failed to save categories: ${item.id}`, error);
        throw error;
      }
    });

    await Promise.all(categories);

    const savePromises = accommodationData.map(async (item) => {
      try {
        const accommodation = accommodationRepository.create(item);
        await accommodationRepository.save(accommodation);

        if (item.address) {
          const address = addressRepository.create(item.address);
          await addressRepository.save(address);

          accommodation.address = address;
        }

        if (item.amenity) {
          const amenity = amenityRepository.create(item.amenity);
          await amenityRepository.save(amenity);
          accommodation.amenity = amenity;
        }

        if (item.images) {
          const images = imageRepository.create(item.images);
          await imageRepository.save(images);
          accommodation.images = images;
        }

        if (item.bookings) {
          const bookings = bookingsRepository.create(item.bookings);
          await bookingsRepository.save(bookings);
          accommodation.bookings = bookings;
        }

        if (item.reviews) {
          const reviews = reviewsRepository.create(item.reviews);
          await reviewsRepository.save(reviews);
          accommodation.reviews = reviews;
        }

        await accommodationRepository.save(accommodation);
      } catch (error) {
        console.error(`Failed to save accommodation: ${item.id}`, error);
        throw error;
      }
    });

    await Promise.all(savePromises);
    console.log('Database seeding completed.');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed(DataSourceConfig).catch((err) => {
  console.error('Error initializing the seeding process:', err);
  process.exit(1);
});
