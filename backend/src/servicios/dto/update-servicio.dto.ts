import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateServicioDto } from './create-servicio.dto.js';

export class UpdateServicioDto extends PartialType(CreateServicioDto) {
  @ApiPropertyOptional({ example: true, description: 'Reactivar o desactivar el servicio' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
