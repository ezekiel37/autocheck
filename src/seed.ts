import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VehiclesService } from './vehicles/vehicles.service';
import { ValuationsService } from './valuations/valuations.service';
import { OffersService } from './offers/offers.service';

async function seed() {
  console.log('Starting database seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const vehiclesService = app.get(VehiclesService);
  const valuationsService = app.get(ValuationsService);
  const offersService = app.get(OffersService);

  try {
    // Seed Vehicles
    console.log('Seeding vehicles...');
    const vehicles = [
      {
        vin: '1HGBH41JXMN109186',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 35000,
        trim: 'XLE',
        color: 'Silver',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        engineSize: '2.5L'
      },
      {
        vin: '5UXWX7C5XBA224567',
        make: 'BMW',
        model: 'X5',
        year: 2021,
        mileage: 22000,
        trim: 'xDrive40i',
        color: 'Black',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        engineSize: '3.0L'
      },
      {
        vin: '1N4AL3AP8JC254789',
        make: 'Nissan',
        model: 'Altima',
        year: 2019,
        mileage: 48000,
        trim: 'SV',
        color: 'White',
        transmission: 'CVT',
        fuelType: 'Gasoline',
        engineSize: '2.5L'
      },
      {
        vin: 'WDDZF4KB5KA123456',
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2022,
        mileage: 15000,
        trim: 'E350',
        color: 'Blue',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        engineSize: '2.0L'
      },
      {
        vin: '2HGFC2F59MH789012',
        make: 'Honda',
        model: 'Civic',
        year: 2018,
        mileage: 62000,
        trim: 'EX',
        color: 'Red',
        transmission: 'Manual',
        fuelType: 'Gasoline',
        engineSize: '2.0L'
      }
    ];

    const createdVehicles = <any>[];
    for (const vehicleData of vehicles) {
      const vehicle = await vehiclesService.create(vehicleData);
      createdVehicles.push(vehicle);
      console.log(`✓ Created vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.vin})`);
    }

    // Seed Valuations
    console.log('\nSeeding valuations...');
    for (const vehicle of createdVehicles) {
      const valuation = await valuationsService.create({ vehicleId: vehicle.id });
      console.log(`✓ Created valuation for ${vehicle.make} ${vehicle.model}: ₦${valuation.estimatedValue.toLocaleString()}`);
    }

    // Seed Offers
    console.log('\nSeeding offers...');
    const offers = [
      {
        title: 'New Year Special',
        description: 'Get 2% discount on your loan interest rate for applications submitted in January',
        discountRate: 2.0,
        offerType: 'loan_discount',
        validFrom: '2025-01-01T00:00:00Z',
        validTo: '2025-01-31T23:59:59Z',
        isActive: true
      },
      {
        title: 'Quick Approval Bonus',
        description: 'Submit your application before month-end and get 1.5% off',
        discountRate: 1.5,
        offerType: 'loan_discount',
        validFrom: '2025-01-15T00:00:00Z',
        validTo: '2025-12-31T23:59:59Z',
        isActive: true
      },
      {
        title: 'Free Valuation Week',
        description: 'Get your vehicle valued for free this week only',
        discountRate: 100.0,
        offerType: 'valuation_discount',
        validFrom: '2025-01-20T00:00:00Z',
        validTo: '2025-01-27T23:59:59Z',
        isActive: true
      }
    ];

    for (const offerData of offers) {
      const offer = await offersService.create(offerData);
      console.log(`✓ Created offer: ${offer.title}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Vehicles: ${createdVehicles.length}`);
    console.log(`   - Valuations: ${createdVehicles.length}`);
    console.log(`   - Offers: ${offers.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed();