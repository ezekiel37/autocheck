import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty({ example: 'New Year Loan Discount' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Get 2% off on your loan interest rate' })
  @IsString()
  description: string;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate: number;

  @ApiProperty({ example: 'loan_discount', enum: ['loan_discount', 'valuation_discount', 'seasonal'] })
  @IsString()
  offerType: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  validTo: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}