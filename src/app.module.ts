import { databaseConfig } from './shared/configs/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/users.module';
import { validateEnv } from './shared/configs/env.config';
import { AccommodationModule } from './modules/accommodations/accommodations.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { UploadModule } from './modules/uploads/upload.module';

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
    UploadModule,
    WishlistsModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    AccommodationModule,
  ],
  providers: [],
})
export class AppModule {}
