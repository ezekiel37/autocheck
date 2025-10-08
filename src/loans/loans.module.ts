import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Valuation } from '../valuations/entities/valuation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Vehicle, Valuation])],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}