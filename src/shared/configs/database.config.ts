import { type ConfigService } from '@nestjs/config';
import { type DataSourceOptions } from 'typeorm';
import { type EnvConfig } from './env.config';
import { Account } from '#/modules/users/entities/account.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';
import { AccommodationImage } from '#/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { Profile } from '#/modules/users/entities/profile.entity';
import { AccountRefreshToken } from '#/modules/auth/entities/account-refresh-token.entity';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { Payment } from '#/modules/payments/entities/payment.entity';
import { Booking } from '#/modules/bookings/entities/booking.entity';
import { Review } from '#/modules/reviews/entities/review.entity';
import { Category } from '#/modules/categories/entities/categories.entity';

export const databaseConfig = (configService: ConfigService<EnvConfig>): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    Review,
    Profile,
    Account,
    Accommodation,
    AccommodationImage,
    AccommodationAmenity,
    AccommodationAddress,
    AccountRefreshToken,
    Wishlist,
    Payment,
    Booking,
    Category,
  ],
  synchronize: false,
});
