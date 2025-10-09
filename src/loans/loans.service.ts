import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Valuation } from '../valuations/entities/valuation.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanStatusDto } from './dto/update-loan.dto';

interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  score: number;
  approvedAmount?: number;
  interestRate?: number;
  monthlyPayment?: number;
}

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Valuation)
    private valuationsRepository: Repository<Valuation>,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<Loan> {
    try {
      const vehicle = await this.vehiclesRepository.findOne({
        where: { id: createLoanDto.vehicleId }
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      const valuation = await this.valuationsRepository.findOne({
        where: { vehicleId: vehicle.id },
        order: { createdAt: 'DESC' }
      });

      if (!valuation) {
        throw new BadRequestException('Vehicle must be valued before applying for a loan');
      }

      const eligibility = this.checkEligibility(createLoanDto, valuation);

      const loan = this.loansRepository.create({
        ...createLoanDto,
        status: eligibility.isEligible ? 'approved' : 'rejected',
        approvedAmount: eligibility.approvedAmount,
        interestRate: eligibility.interestRate,
        monthlyPayment: eligibility.monthlyPayment,
        rejectionReason: eligibility.isEligible ? undefined : eligibility.reasons.join(', '),
        eligibilityData: eligibility
      });

      const savedLoan = await this.loansRepository.save(loan);
      this.logger.log(`Loan application created with ID: ${savedLoan.id}, Status: ${savedLoan.status}`);
      return savedLoan;
    } catch (error) {
      this.logger.error(`Error creating loan: ${error.message}`);
      throw error;
    }
  }

  private checkEligibility(loanDto: CreateLoanDto, valuation: Valuation): EligibilityResult {
    const reasons: string[] = [];
    let score = 100;

    const maxLoanAmount = valuation.estimatedValue * 0.6
    if (loanDto.requestedAmount > maxLoanAmount) {
      reasons.push(`Requested amount exceeds 60% of vehicle value (Max: ₦${maxLoanAmount.toLocaleString()})`);
      score -= 30;
    }

    const monthlyPayment = this.calculateMonthlyPayment(
      loanDto.requestedAmount,
      loanDto.loanTerm,
      this.getBaseInterestRate()
    );
    const dti = (monthlyPayment / loanDto.monthlyIncome) * 100;
    
    if (dti > 40) {
      reasons.push(`Debt-to-income ratio too high (${dti.toFixed(1)}% > 40%)`);
      score -= 40;
    }

    const minIncome = 150000;
    if (loanDto.monthlyIncome < minIncome) {
      reasons.push(`Monthly income below minimum requirement (₦${minIncome.toLocaleString()})`);
      score -= 20;
    }

    const vehicleAge = new Date().getFullYear() - valuation.vehicle?.year;
    const maxTerm = Math.max(84 - (vehicleAge * 12), 24);
    
    if (loanDto.loanTerm > maxTerm) {
      reasons.push(`Loan term too long for vehicle age (Max: ${maxTerm} months)`);
      score -= 10;
    }

    const isEligible = score >= 70 && reasons.length === 0;

    let approvedAmount = loanDto.requestedAmount;
    let interestRate = this.getBaseInterestRate();

    if (isEligible) {
      if (score >= 95) {
        interestRate = 12.5;
      } else if (score >= 85) {
        interestRate = 14.5;
      } else if (score >= 75) {
        interestRate = 16.5;
      } else {
        interestRate = 18.5;
      }

      if (approvedAmount > maxLoanAmount) {
        approvedAmount = maxLoanAmount;
      }
    }

    return {
      isEligible,
      reasons,
      score,
      approvedAmount: isEligible ? approvedAmount : undefined,
      interestRate: isEligible ? interestRate : undefined,
      monthlyPayment: isEligible ? this.calculateMonthlyPayment(approvedAmount, loanDto.loanTerm, interestRate) : undefined
    };
  }

  private getBaseInterestRate(): number {
    return 15.0;
  }

  private calculateMonthlyPayment(principal: number, termMonths: number, annualRate: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                    (Math.pow(1 + monthlyRate, termMonths) - 1);
    return Math.round(payment);
  }

  async findAll(): Promise<Loan[]> {
    return this.loansRepository.find({
      relations: ['vehicle'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: ['vehicle']
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return loan;
  }

  async updateStatus(id: string, updateStatusDto: UpdateLoanStatusDto): Promise<Loan> {
    const loan = await this.findOne(id);

    if (loan.status === 'disbursed' && updateStatusDto.status !== 'disbursed') {
      throw new BadRequestException('Cannot change status of disbursed loan');
    }

    loan.status = updateStatusDto.status;
    
    if (updateStatusDto.status === 'rejected' && updateStatusDto.rejectionReason) {
      loan.rejectionReason = updateStatusDto.rejectionReason;
    }

    const updatedLoan = await this.loansRepository.save(loan);
    this.logger.log(`Loan ${id} status updated to: ${updateStatusDto.status}`);
    return updatedLoan;
  }

  async findByVehicle(vehicleId: string): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { vehicleId },
      order: { createdAt: 'DESC' }
    });
  }

  async getStatistics(): Promise<any> {
    const total = await this.loansRepository.count();
    const approved = await this.loansRepository.count({ where: { status: 'approved' } });
    const pending = await this.loansRepository.count({ where: { status: 'pending' } });
    const rejected = await this.loansRepository.count({ where: { status: 'rejected' } });
    const disbursed = await this.loansRepository.count({ where: { status: 'disbursed' } });

    return {
      total,
      approved,
      pending,
      rejected,
      disbursed,
      approvalRate: total > 0 ? ((approved + disbursed) / total * 100).toFixed(2) : 0
    };
  }
}