import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { EnvConfig } from './env.config';
import { User } from '#/modules/user/entities/user.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationImage } from '#/modules/acccommodation_image/entities/accommodation_image.entity';
import { AccommodationAmenity } from '#/modules/acccommodation_amenity/entities/accommodation_amenity.entity';
import { AccommodationAddress } from '#/modules/acccommodation_address/entities/accommodation_address.entity';

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
    User,
    Accommodation,
    AccommodationImage,
    AccommodationAmenity,
    AccommodationAddress,
  ],
  synchronize: false,
});
