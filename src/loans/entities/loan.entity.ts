import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column()
  vin: string;

  @ManyToOne(() => Vehicle, vehicle => vehicle.loans)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column()
  applicantName: string;

  @Column()
  applicantEmail: string;

  @Column()
  applicantPhone: string;

  @Column('decimal', { precision: 10, scale: 2 })
  requestedAmount: number;

  @Column()
  loanTerm: number; // months

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyIncome: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  interestRate: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  approvedAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  monthlyPayment: number;

  @Column({ default: 'pending' })
  status: string; // pending, approved, rejected, disbursed

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'json', nullable: true })
  eligibilityData: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}