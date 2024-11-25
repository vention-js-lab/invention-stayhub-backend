import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { EnvConfig } from './env.config';
import { Account } from '#/modules/users/entities/account.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationImage } from '#/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { Profile } from '#/modules/users/entities/profile.entity';
import { AccountRefreshToken } from '#/modules/auth/entities/account-refresh-token.entity';
import { Wishlist } from '#/modules/wishlists/entities/wishlist.entity';
import { Payment } from '#/modules/payment/entities/payment.entity';
import { Booking } from '#/modules/bookings/entities/booking.entity';
import { Review } from '#/modules/review/entities/review.entity';

export const databaseConfig = (
  configService: ConfigService<EnvConfig>,
): DataSourceOptions => ({
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
  ],
  synchronize: false,
});
