import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Accommodation } from './entities/accommodations.entity';
import { AccommodationController } from './controllers/accommodations.controller';
import { AccommodationService } from './services/accommodations.service';
import { AccommodationAddressService } from './services/accommodation-address.service';
import { AccommodationImageService } from './services/accommodation-image.service';
import { AccommodationAmenityService } from './services/accommodation-amenity.service';
import { AccommodationAmenity } from './entities/accommodation-amenity.entity';
import { AccommodationAddress } from './entities/accommodation-address.entity';
import { AccommodationImage } from './entities/accommodation-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation, AccommodationAmenity, AccommodationAddress, AccommodationImage])],
  controllers: [AccommodationController],
  providers: [AccommodationService, AccommodationAddressService, AccommodationImageService, AccommodationAmenityService],
  exports: [AccommodationService],
})
export class AccommodationModule {}
