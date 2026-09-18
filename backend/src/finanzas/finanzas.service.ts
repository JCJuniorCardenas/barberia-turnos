import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEgresoDto } from './dto/create-egreso.dto.js';
import { Movimiento, TipoMovimiento } from './entities/movimiento.entity.js';

const argentinaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

@Injectable()
export class FinanzasService {
  constructor(@InjectRepository(Movimiento) private readonly repository: Repository<Movimiento>) {}

  createIngreso(data: { monto: number; concepto: string; fecha: string; turnoId: string }): Promise<Movimiento> {
    return this.repository.save(this.repository.create({ ...data, tipo: TipoMovimiento.INGRESO }));
  }

  createEgreso(dto: CreateEgresoDto): Promise<Movimiento> {
    return this.repository.save(this.repository.create({ ...dto, tipo: TipoMovimiento.EGRESO, fecha: argentinaToday() }));
  }

  async list(fechaDesde?: string, fechaHasta?: string): Promise<Movimiento[]> {
    const query = this.repository.createQueryBuilder('movimiento').orderBy('movimiento.fecha', 'DESC').addOrderBy('movimiento.createdAt', 'DESC');
    if (fechaDesde) query.andWhere('movimiento.fecha >= :fechaDesde', { fechaDesde });
    if (fechaHasta) query.andWhere('movimiento.fecha <= :fechaHasta', { fechaHasta });
    return query.getMany();
  }

  async balance(fechaDesde?: string, fechaHasta?: string) {
    const movimientos = await this.list(fechaDesde, fechaHasta);
    const ingresos = movimientos.filter((item) => item.tipo === TipoMovimiento.INGRESO).reduce((sum, item) => sum + Number(item.monto), 0);
    const egresos = movimientos.filter((item) => item.tipo === TipoMovimiento.EGRESO).reduce((sum, item) => sum + Number(item.monto), 0);
    return { ingresos, egresos, balance: ingresos - egresos, cantidadMovimientos: movimientos.length };
  }
}
