import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('valuations')
export class Valuation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @ManyToOne(() => Vehicle, vehicle => vehicle.valuations)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column('decimal', { precision: 10, scale: 2 })
  estimatedValue: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minValue: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxValue: number;

  @Column()
  valuationMethod: string; // 'API' or 'INTERNAL'

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ default: 'completed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}