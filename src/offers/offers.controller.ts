import { Controller, Get, Post, Body, Param, Patch, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new offer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Offer created successfully' })
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all offers' })
  findAll() {
    return this.offersService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active offers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns active offers' })
  findActive() {
    return this.offersService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns offer details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Offer not found' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate offer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Offer deactivated' })
  deactivate(@Param('id') id: string) {
    return this.offersService.deactivate(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate offer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Offer activated' })
  activate(@Param('id') id: string) {
    return this.offersService.activate(id);
  }
}