import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Valuation } from '../../valuations/entities/valuation.entity';
import { Loan } from '../../loans/entities/loan.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vin: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  mileage: number;

  @Column({ nullable: true })
  trim: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  transmission: string;

  @Column({ nullable: true })
  fuelType: string;

  @Column({ nullable: true })
  engineSize: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => Valuation, valuation => valuation.vehicle)
  valuations: Valuation[];

  @OneToMany(() => Loan, loan => loan.vehicle)
  loans: Loan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}