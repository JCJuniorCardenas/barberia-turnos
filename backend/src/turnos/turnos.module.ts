import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { HorariosModule } from '../horarios/horarios.module.js';
import { ServiciosModule } from '../servicios/servicios.module.js';
import { Turno } from './entities/turno.entity.js';
import { TurnosController } from './turnos.controller.js';
import { TurnosService } from './turnos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Turno]), ServiciosModule, HorariosModule, AuthModule],
  controllers: [TurnosController],
  providers: [TurnosService],
})
export class TurnosModule {}
