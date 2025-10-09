import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@ApiBearerAuth('access-token')
@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Ingest vehicle data' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vehicle created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Vehicle with VIN already exists' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all vehicles' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns vehicle details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vehicle not found' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Get('vin/:vin')
  @ApiOperation({ summary: 'Get vehicle valuation by VIN' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns vehicle details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vehicle not found' })
  findByVin(@Param('vin') vin: string) {
    return this.vehiclesService.getVehicleValuation(vin);
  }
}