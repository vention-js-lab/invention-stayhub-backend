import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Accommodation } from './entities/accommodation.entity';
import { AccommodationsController } from './controllers/accommodations.controller';
import { AccommodationsService } from './services/accommodations.service';
import { AccommodationAddressService } from './services/accommodation-address.service';
import { AccommodationImageService } from './services/accommodation-image.service';
import { AccommodationAmenityService } from './services/accommodation-amenity.service';
import { AccommodationAmenity } from './entities/accommodation-amenity.entity';
import { AccommodationAddress } from './entities/accommodation-address.entity';
import { AccommodationImage } from './entities/accommodation-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation, AccommodationAmenity, AccommodationAddress, AccommodationImage])],
  controllers: [AccommodationsController],
  providers: [AccommodationsService, AccommodationAddressService, AccommodationImageService, AccommodationAmenityService],
  exports: [AccommodationsService],
})
export class AccommodationsModule {}
