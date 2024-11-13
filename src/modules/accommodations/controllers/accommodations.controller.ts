import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';
import { Request } from 'express';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';

@ApiTags('Accommodations')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new accommodation' })
  @ApiResponse({
    status: 201,
    description: 'Accommodation created successfully.',
    type: Accommodation,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
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
