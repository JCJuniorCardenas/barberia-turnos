import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Matches } from 'class-validator';

export class UpdateHorarioDto {
  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe tener formato HH:mm' })
  horaInicio?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaFin debe tener formato HH:mm' })
  horaFin?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  cerrado?: boolean;
}
