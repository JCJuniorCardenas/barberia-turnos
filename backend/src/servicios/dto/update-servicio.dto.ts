import { PartialType } from '@nestjs/swagger';
import { CreateServicioDto } from './create-servicio.dto.js';

export class UpdateServicioDto extends PartialType(CreateServicioDto) {}
