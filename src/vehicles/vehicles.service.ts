import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private httpService: HttpService,
    private readonly configService: ConfigService,

  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      // Check if VIN already exists
      const existingVehicle = await this.vehiclesRepository.findOne({
        where: { vin: createVehicleDto.vin }
      });

      if (existingVehicle) {
        throw new ConflictException('Vehicle with this VIN already exists');
      }

      const vehicle = this.vehiclesRepository.create(createVehicleDto);
      const savedVehicle = await this.vehiclesRepository.save(vehicle);
      this.logger.log(`Vehicle created with ID: ${savedVehicle.id}`);
      return savedVehicle;
    } catch (error) {
      this.logger.error(`Error creating vehicle: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ['valuations', 'loans']
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async findByVin(vin: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { vin }
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with VIN ${vin} not found`);
    }

    return vehicle;
  }


  async getVehicleValuation(vin: string): Promise<any> {
    if (!vin || vin.length !== 17) {
      throw new BadRequestException('Invalid VIN format');
    }

    const url = `https://vin-lookup2.p.rapidapi.com/vehicle-lookup?vin=${vin}`;
    const apiKey = this.configService.get<string>('RAPIDAPI_KEY');
    this.logger.debug(`Using RAPIDAPI_KEY: ${apiKey}`);
    const headers = {
      'X-RapidAPI-Host': 'vin-lookup2.p.rapidapi.com',
      'X-RapidAPI-Key': apiKey,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching vehicle valuation for VIN ${vin}: ${error.message}`);
      if (error.response?.status === 404) {
        throw new NotFoundException(`Vehicle valuation not found for VIN: ${vin}`);
      }
      throw new InternalServerErrorException('Failed to fetch vehicle valuation');
    }
  }
}

