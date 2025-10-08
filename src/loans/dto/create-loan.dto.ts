import { IsString, IsNumber, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  vehicleId: string;

  @ApiProperty({ example: '1HGCM82633A123456', description: 'Vehicle Identification Number' })
  @IsString()
  vin: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  applicantName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  applicantEmail: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  applicantPhone: string;

  @ApiProperty({ example: 5000000 })
  @IsNumber()
  @Min(100000)
  requestedAmount: number;

  @ApiProperty({ example: 36, description: 'Loan term in months' })
  @IsNumber()
  @Min(6)
  @Max(84)
  loanTerm: number;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  monthlyIncome: number;
}