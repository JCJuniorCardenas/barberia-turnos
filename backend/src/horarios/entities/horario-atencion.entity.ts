import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('horarios_atencion')
@Unique(['diaSemana'])
export class HorarioAtencion {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 1, minimum: 0, maximum: 6 })
  @Column({ name: 'dia_semana', type: 'smallint' })
  diaSemana!: number;

  @ApiProperty({ example: '09:00' })
  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio!: string;

  @ApiProperty({ example: '18:00' })
  @Column({ name: 'hora_fin', type: 'time' })
  horaFin!: string;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', default: false })
  cerrado!: boolean;
}
