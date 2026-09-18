import { BadRequestException, Controller, Get, Param, Patch, Post, Query, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
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

  @Get('mi-turno/:codigo')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  findByAccessCode(@Param('codigo') codigo: string) { return this.service.findByAccessCode(codigo); }

  @Patch('mi-turno/:codigo/cancelar')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  cancelByAccessCode(@Param('codigo') codigo: string) { return this.service.cancelByAccessCode(codigo); }

  @Get('resumen')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  summary(@Query('fecha') fecha?: string) {
    return this.service.summary(fecha || new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()));
  }

  @Get()
  @SkipThrottle()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar turnos para administración' })
  findAll(@Query() query: ListTurnosDto) { return this.service.findAll(query.fecha, query.nombreCliente); }

  @Patch(':id/cancelar')
  @SkipThrottle()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar un turno' })
  cancel(@Param('id') id: string) { return this.service.cancel(id); }

  @Patch(':id/confirmar')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmar un turno' })
  confirm(@Param('id') id: string) { return this.service.confirm(id); }

  @Patch(':id/completar')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar un turno como completado' })
  complete(@Param('id') id: string) { return this.service.complete(id); }
}
