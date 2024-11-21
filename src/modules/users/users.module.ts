import { Wishlist } from './../wishlists/entities/wishlist.entity';
import { UploadModule } from './../uploads/upload.module';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Profile, Wishlist]),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
