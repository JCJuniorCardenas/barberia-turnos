import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'admin@elvasco.com' })
  @Column({ type: 'varchar', unique: true, length: 180 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  password!: string;
}
