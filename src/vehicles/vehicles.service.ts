import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
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
}