import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Accommodation } from './entities/accom.entity';
import { AccommodationController } from './accom.controller';
import { AccommodationService } from './accom.service';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
