import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Servicio } from '../../servicios/entities/servicio.entity.js';

export enum EstadoTurno { PENDIENTE = 'pendiente', CONFIRMADO = 'confirmado', COMPLETADO = 'completado', CANCELADO = 'cancelado' }

@Entity('turnos')
export class Turno {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => Servicio, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'servicio_id' })
  servicio!: Servicio;

  @Column({ name: 'servicio_id', type: 'uuid' }) servicioId!: string;
  @ApiProperty({ example: 'Juan Pérez' }) @Column({ name: 'nombre_cliente', type: 'varchar', length: 120 }) nombreCliente!: string;
  @ApiProperty({ example: '1123456789' }) @Column({ name: 'telefono_cliente', type: 'varchar', length: 30 }) telefonoCliente!: string;
  @ApiProperty({ example: 'AB12CD34' }) @Column({ name: 'codigo_acceso', type: 'varchar', length: 8, unique: true }) codigoAcceso!: string;
  @ApiProperty({ example: '2026-09-01' }) @Column({ type: 'date' }) fecha!: string;
  @ApiProperty({ example: '09:30' }) @Column({ type: 'time' }) hora!: string;
  @ApiProperty({ enum: EstadoTurno }) @Column({ type: 'enum', enum: EstadoTurno, default: EstadoTurno.PENDIENTE }) estado!: EstadoTurno;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
}
