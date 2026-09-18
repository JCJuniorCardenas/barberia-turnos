import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Turno } from '../../turnos/entities/turno.entity.js';

export enum TipoMovimiento { INGRESO = 'ingreso', EGRESO = 'egreso' }

@Entity('movimientos_financieros')
export class Movimiento {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ApiProperty({ enum: TipoMovimiento })
  @Column({ type: 'enum', enum: TipoMovimiento }) tipo!: TipoMovimiento;
  @ApiProperty({ example: 8500 })
  @Column({ type: 'numeric', precision: 12, scale: 2 }) monto!: number;
  @ApiProperty({ example: 'Corte de cabello' })
  @Column({ type: 'varchar', length: 200 }) concepto!: string;
  @ApiProperty({ example: '2026-09-16' })
  @Column({ type: 'date' }) fecha!: string;
  @ApiPropertyOptional({ format: 'uuid' })
  @Column({ name: 'turno_id', type: 'uuid', nullable: true, unique: true }) turnoId!: string | null;
  @ManyToOne(() => Turno, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'turno_id' }) turno!: Turno | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
}
