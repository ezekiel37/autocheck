import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';

@ApiTags('valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(private readonly valuationsService: ValuationsService) {}

  @Post()
  @ApiOperation({ summary: 'Request vehicle valuation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Valuation created successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vehicle not found' })
  create(@Body() createValuationDto: CreateValuationDto) {
    return this.valuationsService.create(createValuationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all valuations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all valuations' })
  findAll() {
    return this.valuationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get valuation by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns valuation details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Valuation not found' })
  findOne(@Param('id') id: string) {
    return this.valuationsService.findOne(id);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get valuations by vehicle ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns vehicle valuations' })
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.valuationsService.findByVehicle(vehicleId);
  }
}