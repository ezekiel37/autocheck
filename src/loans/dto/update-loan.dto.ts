import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLoanStatusDto {
  @ApiProperty({ example: 'approved', enum: ['pending', 'approved', 'rejected', 'disbursed'] })
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'disbursed'])
  status: string;

  @ApiProperty({ example: 'Insufficient income', required: false })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}