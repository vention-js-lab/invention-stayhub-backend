import { databaseConfig } from './shared/configs/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { validateEnv } from './shared/configs/env.config';
import { AccommodationsModule } from './modules/accommodations/accommodations.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    ReviewsModule,
    UploadsModule,
    WishlistsModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    AccommodationsModule,
    PaymentsModule,
    BookingsModule,
    CategoriesModule,
  ],
  providers: [],
})
export class AppModule {}
