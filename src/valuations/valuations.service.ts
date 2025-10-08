import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Valuation } from './entities/valuation.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { CreateValuationDto } from './dto/create-valuation.dto';
import axios from 'axios';

@Injectable()
export class ValuationsService {
  private readonly logger = new Logger(ValuationsService.name);

  constructor(
    @InjectRepository(Valuation)
    private valuationsRepository: Repository<Valuation>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createValuationDto: CreateValuationDto): Promise<Valuation> {
    try {
      const vehicle = await this.vehiclesRepository.findOne({
        where: { id: createValuationDto.vehicleId }
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      let valuationData;
      try {
        valuationData = await this.getValuationFromAPI(vehicle);
      } catch (apiError) {
        this.logger.warn('External API failed, using internal valuation model');
        valuationData = this.getInternalValuation(vehicle);
      }

      const valuation = this.valuationsRepository.create({
        vehicleId: vehicle.id,
        estimatedValue: valuationData.estimatedValue,
        minValue: valuationData.minValue,
        maxValue: valuationData.maxValue,
        valuationMethod: valuationData.method,
        metadata: valuationData.metadata,
        status: 'completed'
      });

      const savedValuation = await this.valuationsRepository.save(valuation);
      this.logger.log(`Valuation created with ID: ${savedValuation.id}`);
      return savedValuation;
    } catch (error) {
      this.logger.error(`Error creating valuation: ${error.message}`);
      throw error;
    }
  }

  private async getValuationFromAPI(vehicle: Vehicle): Promise<any> {
    const apiKey = process.env.RAPIDAPI_KEY;
    
    if (!apiKey) {
      throw new Error('RapidAPI key not configured');
    }

    try {
      const response = await axios.get(`https://vin-lookup-by-jack-roe.p.rapidapi.com/vin_lookup`, {
        params: { vin: vehicle.vin },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'vin-lookup-by-jack-roe.p.rapidapi.com'
        }
      });

      const data = response.data;
      const baseValue = this.calculateBaseValue(vehicle);
      
      return {
        estimatedValue: baseValue,
        minValue: baseValue * 0.85,
        maxValue: baseValue * 1.15,
        method: 'API',
        metadata: data
      };
    } catch (error) {
      throw error;
    }
  }

  private getInternalValuation(vehicle: Vehicle): any {
    const baseValue = this.calculateBaseValue(vehicle);
    
    return {
      estimatedValue: baseValue,
      minValue: baseValue * 0.85,
      maxValue: baseValue * 1.15,
      method: 'INTERNAL',
      metadata: {
        depreciationRate: this.getDepreciationRate(vehicle.year),
        mileageAdjustment: this.getMileageAdjustment(vehicle.mileage)
      }
    };
  }

  private calculateBaseValue(vehicle: Vehicle): number {
    const basePrices: Record<string, number> = {
      'Toyota': 8000000,
      'Honda': 7500000,
      'Mercedes-Benz': 15000000,
      'BMW': 14000000,
      'Ford': 6000000,
      'Nissan': 6500000,
      'Hyundai': 5500000,
      'default': 5000000
    };

    const basePrice = basePrices[vehicle.make] || basePrices['default'];
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicle.year;
    
    const depreciationRate = Math.pow(0.85, age);
    let value = basePrice * depreciationRate;
    
    const mileageAdjustment = 1 - (vehicle.mileage / 50000) * 0.1;
    value *= Math.max(mileageAdjustment, 0.5);
    
    return Math.round(value);
  }

  private getDepreciationRate(year: number): number {
    const age = new Date().getFullYear() - year;
    return Math.pow(0.85, age);
  }

  private getMileageAdjustment(mileage: number): number {
    return 1 - (mileage / 50000) * 0.1;
  }

  async findAll(): Promise<Valuation[]> {
    return this.valuationsRepository.find({
      relations: ['vehicle'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Valuation> {
    const valuation = await this.valuationsRepository.findOne({
      where: { id },
      relations: ['vehicle']
    });

    if (!valuation) {
      throw new NotFoundException(`Valuation with ID ${id} not found`);
    }

    return valuation;
  }

  async findByVehicle(vehicleId: string): Promise<Valuation[]> {
    return this.valuationsRepository.find({
      where: { vehicleId },
      order: { createdAt: 'DESC' }
    });
  }
}