import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min, MaxLength } from 'class-validator';

export class CreateServicioDto {
  @ApiProperty({ example: 'Corte' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({ example: 45, description: 'Duración en minutos' })
  @IsInt()
  @Min(5)
  @Max(480)
  duracionMinutos!: number;

  @ApiProperty({ example: 8500, description: 'Precio en pesos' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio!: number;
}
