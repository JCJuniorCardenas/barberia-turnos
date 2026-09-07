import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { HorarioAtencion } from './entities/horario-atencion.entity.js';
import { DiaBloqueado } from './entities/dia-bloqueado.entity.js';
import { HorariosController } from './horarios.controller.js';
import { HorariosService } from './horarios.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioAtencion, DiaBloqueado]), AuthModule],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [HorariosService],
})
export class HorariosModule {}
