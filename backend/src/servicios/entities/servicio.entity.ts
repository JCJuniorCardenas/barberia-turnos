import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('servicios')
export class Servicio {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Corte' })
  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @ApiProperty({ example: 45, description: 'Duración en minutos' })
  @Column({ name: 'duracion_minutos', type: 'int' })
  duracionMinutos!: number;

  @ApiProperty({ example: 8500, description: 'Precio en pesos' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio!: number;
}
