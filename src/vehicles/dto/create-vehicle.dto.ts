import { IsString, IsNumber, IsOptional, Length, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: '1HGBH41JXMN109186' })
  @IsString()
  @Length(17, 17)
  vin: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  mileage: number;

  @ApiProperty({ example: 'XLE', required: false })
  @IsOptional()
  @IsString()
  trim?: string;

  @ApiProperty({ example: 'Silver', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 'Automatic', required: false })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiProperty({ example: 'Gasoline', required: false })
  @IsOptional()
  @IsString()
  fuelType?: string;

  @ApiProperty({ example: '2.5L', required: false })
  @IsOptional()
  @IsString()
  engineSize?: string;
}