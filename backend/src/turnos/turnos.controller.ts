import { BadRequestException, Controller, Get, Param, Patch, Post, Query, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreateTurnoDto } from './dto/create-turno.dto.js';
import { ListTurnosDto } from './dto/list-turnos.dto.js';
import { TurnosService } from './turnos.service.js';

@ApiTags('turnos')
@Controller('turnos')
export class TurnosController {
  constructor(private readonly service: TurnosService) {}

  @Get('disponibles')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Consultar horarios libres' })
  available(@Query('fecha') fecha: string, @Query('servicioId') servicioId: string) {
    if (!fecha || !servicioId) throw new BadRequestException('fecha y servicioId son obligatorios');
    return this.service.availableSlots(fecha, servicioId);
  }

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Crear un turno público' })
  create(@Body() dto: CreateTurnoDto) { return this.service.create(dto); }

  @Get()
  @SkipThrottle()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar turnos para administración' })
  findAll(@Query() query: ListTurnosDto) { return this.service.findAll(query.fecha); }

  @Patch(':id/cancelar')
  @SkipThrottle()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar un turno' })
  cancel(@Param('id') id: string) { return this.service.cancel(id); }

  @Patch(':id/confirmar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmar un turno' })
  confirm(@Param('id') id: string) { return this.service.confirm(id); }
}
