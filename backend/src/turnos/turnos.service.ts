import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorariosService } from '../horarios/horarios.service.js';
import { ServiciosService } from '../servicios/servicios.service.js';
import { CreateTurnoDto } from './dto/create-turno.dto.js';
import { EstadoTurno, Turno } from './entities/turno.entity.js';
import { randomBytes } from 'node:crypto';
import { FinanzasService } from '../finanzas/finanzas.service.js';

const toMinutes = (time: string) => { const [h, m] = time.slice(0, 5).split(':').map(Number); return h * 60 + m; };
const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
const argentinaDate = (fecha: string) => {
  const date = new Date(`${fecha}T12:00:00-03:00`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== fecha) throw new BadRequestException('Fecha inválida');
  return date;
};
const argentinaNowMinutes = () => {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(values.hour) * 60 + Number(values.minute);
};
const argentinaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno) private readonly repository: Repository<Turno>,
    private readonly servicios: ServiciosService,
    private readonly horarios: HorariosService,
    private readonly finanzas: FinanzasService,
  ) {}

  async availableSlots(fecha: string, servicioId: string): Promise<string[]> {
    const date = argentinaDate(fecha);
    if (await this.horarios.isDayBlocked(fecha)) return [];
    const [horario, servicio] = await Promise.all([this.horarios.findByDay(date.getDay()), this.servicios.findOne(servicioId)]);
    if (!horario || horario.cerrado) return [];
    const appointments = await this.repository.find({ where: { fecha }, relations: { servicio: true } });
    const start = toMinutes(horario.horaInicio);
    const end = toMinutes(horario.horaFin);
    const duration = servicio.duracionMinutos;
    const today = argentinaToday();
    const minimumStart = fecha === today ? argentinaNowMinutes() + 15 : null;
    const free: string[] = [];
    for (let slot = start; slot + duration <= end; slot += 30) {
      if (minimumStart !== null && slot < minimumStart) continue;
      const overlaps = appointments.some((appointment) => appointment.estado !== EstadoTurno.CANCELADO && slot < toMinutes(appointment.hora) + appointment.servicio.duracionMinutos && slot + duration > toMinutes(appointment.hora));
      if (!overlaps) free.push(toTime(slot));
    }
    return free;
  }

  async create(dto: CreateTurnoDto): Promise<Turno> {
    const service = await this.servicios.findOne(dto.servicioId);
    return this.repository.manager.transaction(async (manager) => {
      // Serializa las reservas de un mismo día dentro de PostgreSQL.
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`turno:${dto.fecha}`]);

      const available = await this.availableSlots(dto.fecha, dto.servicioId);
      if (!available.includes(dto.hora)) {
        throw new ConflictException('Este horario ya no está disponible, elegí otro');
      }

      const turno = manager.create(Turno, { ...dto, servicio: service, codigoAcceso: randomBytes(6).toString('hex').slice(0, 8).toUpperCase(), estado: EstadoTurno.PENDIENTE });
      return manager.save(Turno, turno);
    });
  }

  findAll(fecha?: string, nombreCliente?: string): Promise<Turno[]> {
    const query = this.repository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.servicio', 'servicio')
      .orderBy('turno.fecha', 'ASC').addOrderBy('turno.hora', 'ASC');
    if (fecha) query.andWhere('turno.fecha = :fecha', { fecha });
    if (nombreCliente?.trim()) query.andWhere('LOWER(turno.nombreCliente) LIKE LOWER(:nombre)', { nombre: `%${nombreCliente.trim()}%` });
    return query.getMany();
  }

  async summary(fecha: string): Promise<{ total: number; pendientes: number; confirmados: number; cancelados: number }> {
    argentinaDate(fecha);
    const rows = await this.repository.createQueryBuilder('turno').select('turno.estado', 'estado').addSelect('COUNT(*)', 'cantidad').where('turno.fecha = :fecha', { fecha }).groupBy('turno.estado').getRawMany<{ estado: EstadoTurno; cantidad: string }>();
    const result = { total: 0, pendientes: 0, confirmados: 0, cancelados: 0 };
    for (const row of rows) {
      const count = Number(row.cantidad);
      result.total += count;
      if (row.estado === EstadoTurno.PENDIENTE) result.pendientes = count;
      if (row.estado === EstadoTurno.CONFIRMADO) result.confirmados = count;
      if (row.estado === EstadoTurno.CANCELADO) result.cancelados = count;
    }
    return result;
  }

  async findByAccessCode(codigo: string): Promise<Pick<Turno, 'fecha' | 'hora' | 'estado' | 'codigoAcceso'> & { servicio: { nombre: string; duracionMinutos: number } }> {
    const turno = await this.repository.findOne({ where: { codigoAcceso: codigo.toUpperCase() }, relations: { servicio: true } });
    if (!turno) throw new NotFoundException('No encontramos ese turno');
    return { codigoAcceso: turno.codigoAcceso, fecha: turno.fecha, hora: turno.hora, estado: turno.estado, servicio: { nombre: turno.servicio.nombre, duracionMinutos: turno.servicio.duracionMinutos } };
  }

  async cancelByAccessCode(codigo: string): Promise<Pick<Turno, 'fecha' | 'hora' | 'estado' | 'codigoAcceso'> & { servicio: { nombre: string; duracionMinutos: number } }> {
    const turno = await this.repository.findOne({ where: { codigoAcceso: codigo.toUpperCase() }, relations: { servicio: true } });
    if (!turno) throw new NotFoundException('No encontramos ese turno');
    if (turno.estado === EstadoTurno.CANCELADO) throw new ConflictException('Este turno ya está cancelado');
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());
    if (turno.fecha < today) throw new ConflictException('No se puede cancelar un turno que ya pasó');
    turno.estado = EstadoTurno.CANCELADO;
    await this.repository.save(turno);
    return this.findByAccessCode(codigo);
  }

  async confirm(id: string): Promise<Turno> {
    const turno = await this.repository.findOne({ where: { id }, relations: { servicio: true } });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    if (turno.estado === EstadoTurno.CANCELADO) throw new BadRequestException('No se puede confirmar un turno cancelado');
    turno.estado = EstadoTurno.CONFIRMADO;
    return this.repository.save(turno);
  }

  async cancel(id: string): Promise<Turno> {
    const turno = await this.repository.findOne({ where: { id }, relations: { servicio: true } });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    turno.estado = EstadoTurno.CANCELADO;
    return this.repository.save(turno);
  }

  async complete(id: string): Promise<Turno> {
    const turno = await this.repository.findOne({ where: { id }, relations: { servicio: true } });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    if (turno.estado === EstadoTurno.CANCELADO) throw new BadRequestException('No se puede completar un turno cancelado');
    if (turno.estado === EstadoTurno.COMPLETADO) return turno;
    turno.estado = EstadoTurno.COMPLETADO;
    const saved = await this.repository.save(turno);
    await this.finanzas.createIngreso({ monto: Number(turno.servicio.precio), concepto: `${turno.servicio.nombre} — ${turno.nombreCliente}`, fecha: turno.fecha, turnoId: turno.id });
    return saved;
  }
}
