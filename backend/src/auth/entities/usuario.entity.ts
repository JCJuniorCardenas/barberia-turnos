import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RolUsuario { ADMIN = 'admin' }

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

  @Column({ type: 'varchar', length: 20, default: RolUsuario.ADMIN })
  rol!: RolUsuario;
}
