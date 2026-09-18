import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Movimiento } from './entities/movimiento.entity.js';
import { FinanzasController } from './finanzas.controller.js';
import { FinanzasService } from './finanzas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento]), AuthModule],
  controllers: [FinanzasController],
  providers: [FinanzasService],
  exports: [FinanzasService],
})
export class FinanzasModule {}
