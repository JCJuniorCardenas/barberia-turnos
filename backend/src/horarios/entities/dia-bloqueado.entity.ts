import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('dias_bloqueados')
@Unique(['fecha'])
export class DiaBloqueado {
  @ApiProperty({ example: '2026-12-24' })
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ type: 'date' }) fecha!: string;

  @Column({ type: 'varchar', length: 160, nullable: true }) motivo!: string | null;
}
