import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreateEgresoDto } from './dto/create-egreso.dto.js';
import { FinanzasService } from './finanzas.service.js';

@ApiTags('finanzas')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@Controller('finanzas')
export class FinanzasController {
  constructor(private readonly service: FinanzasService) {}

  @Get('movimientos')
  @ApiOperation({ summary: 'Listar movimientos financieros' })
  list(@Query('fechaDesde') fechaDesde?: string, @Query('fechaHasta') fechaHasta?: string) { return this.service.list(fechaDesde, fechaHasta); }

  @Get('balance')
  @ApiOperation({ summary: 'Consultar balance financiero' })
  balance(@Query('fechaDesde') fechaDesde?: string, @Query('fechaHasta') fechaHasta?: string) { return this.service.balance(fechaDesde, fechaHasta); }

  @Post('egresos')
  @ApiOperation({ summary: 'Registrar un egreso manual' })
  createEgreso(@Body() dto: CreateEgresoDto) { return this.service.createEgreso(dto); }
}
