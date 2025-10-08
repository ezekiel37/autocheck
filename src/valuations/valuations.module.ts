import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValuationsController } from './valuations.controller';
import { ValuationsService } from './valuations.service';
import { Valuation } from './entities/valuation.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Valuation, Vehicle])],
  controllers: [ValuationsController],
  providers: [ValuationsService],
  exports: [ValuationsService],
})
export class ValuationsModule {}