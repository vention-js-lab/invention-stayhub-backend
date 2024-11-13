import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';
import { Request } from 'express';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Post()
  async create(
    @Body() accommodationDto: AccommodationDto,
    @Req() request: Request,
  ): Promise<Accommodation> {
    const ownerId = request.user?.accountId;
    if (!ownerId) {
      throw new Error('Account ID is missing in the request');
    }
    return this.accommodationService.create(accommodationDto, ownerId);
  }
}
