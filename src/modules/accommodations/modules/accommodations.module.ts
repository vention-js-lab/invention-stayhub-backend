import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Accommodation } from '../entities/accommodations.entity';
import { AccommodationsController } from '../controllers/accommodations.controller';
import { AccommodationsService } from '../services/accommodations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])],
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
})
export class AccommodationModule {}
