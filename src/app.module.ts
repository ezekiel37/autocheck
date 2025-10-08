import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoanModule } from './loan/loan.module';
import { OffersModule } from './offers/offers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ValuationsModule } from './valuations/valuations.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [LoanModule, OffersModule, VehiclesModule, ValuationsModule, LoansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
