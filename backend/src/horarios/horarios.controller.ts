import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { UseGuards } from '@nestjs/common';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';
import { BloquearDiaDto } from './dto/bloquear-dia.dto.js';
import { HorariosService } from './horarios.service.js';

@ApiTags('horarios')
@Controller('horarios')
export class HorariosController {
  constructor(private readonly service: HorariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar los horarios de atención' })
  findAll() { return this.service.findAll(); }

  @Patch(':diaSemana')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar el horario de un día' })
  update(@Param('diaSemana', ParseIntPipe) diaSemana: number, @Body() dto: UpdateHorarioDto) {
    if (diaSemana < 0 || diaSemana > 6) throw new BadRequestException('diaSemana debe estar entre 0 y 6');
    return this.service.updateByDay(diaSemana, dto);
  }

  @Get('dias-bloqueados')
  findBlockedDays() { return this.service.findBlockedDays(); }

  @Post('bloquear-dia')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  blockDay(@Body() dto: BloquearDiaDto) { return this.service.blockDay(dto); }

  @Delete('bloquear-dia/:fecha')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  unblockDay(@Param('fecha') fecha: string) { return this.service.unblockDay(fecha); }
}
