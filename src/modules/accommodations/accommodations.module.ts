import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Accommodation } from './entities/accommodations.entity';
import { AccommodationController } from './accommodations.controller';
import { AccommodationService } from './accommodations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
