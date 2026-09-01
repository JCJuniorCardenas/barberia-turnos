import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Matches, MaxLength, IsString } from 'class-validator';

export class CreateTurnoDto {
  @ApiProperty({ format: 'uuid' }) @IsUUID() servicioId!: string;
  @ApiProperty({ example: 'Juan Pérez' }) @IsString() @IsNotEmpty() @MaxLength(120) nombreCliente!: string;
  @ApiProperty({ example: '+5491123456789' }) @IsString() @Matches(/^\+?[0-9]{8,15}$/, { message: 'telefonoCliente debe contener solo números y opcionalmente comenzar con +' }) telefonoCliente!: string;
  @ApiProperty({ example: '2026-09-01' }) @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' }) fecha!: string;
  @ApiProperty({ example: '09:30' }) @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'hora debe tener formato HH:mm' }) hora!: string;
}
