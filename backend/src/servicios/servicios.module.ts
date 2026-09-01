import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity.js';
import { ServiciosController } from './servicios.controller.js';
import { ServiciosService } from './servicios.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  controllers: [ServiciosController],
  providers: [ServiciosService],
  exports: [ServiciosService],
})
export class ServiciosModule {}
