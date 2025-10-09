import { Controller, Get, Post, Body, Param, Patch, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanStatusDto } from './dto/update-loan.dto';

@ApiBearerAuth('access-token')
@ApiTags('loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Submit loan application' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Loan application submitted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vehicle not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Vehicle must be valued first' })
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loan applications' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all loans' })
  findAll() {
    return this.loansService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get loan statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns loan statistics' })
  getStatistics() {
    return this.loansService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns loan details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Loan not found' })
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update loan status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Loan status updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Loan not found' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateLoanStatusDto) {
    return this.loansService.updateStatus(id, updateStatusDto);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get loans by vehicle ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns vehicle loans' })
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.loansService.findByVehicle(vehicleId);
  }
}