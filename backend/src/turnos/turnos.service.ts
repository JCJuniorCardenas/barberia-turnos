import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorariosService } from '../horarios/horarios.service.js';
import { ServiciosService } from '../servicios/servicios.service.js';
import { CreateTurnoDto } from './dto/create-turno.dto.js';
import { EstadoTurno, Turno } from './entities/turno.entity.js';

const toMinutes = (time: string) => { const [h, m] = time.slice(0, 5).split(':').map(Number); return h * 60 + m; };
const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
const argentinaDate = (fecha: string) => {
  const date = new Date(`${fecha}T12:00:00-03:00`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== fecha) throw new BadRequestException('Fecha inválida');
  return date;
};

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno) private readonly repository: Repository<Turno>,
    private readonly servicios: ServiciosService,
    private readonly horarios: HorariosService,
  ) {}

  async availableSlots(fecha: string, servicioId: string): Promise<string[]> {
    const date = argentinaDate(fecha);
    const [horario, servicio] = await Promise.all([this.horarios.findByDay(date.getDay()), this.servicios.findOne(servicioId)]);
    if (!horario || horario.cerrado) return [];
    const appointments = await this.repository.find({ where: { fecha }, relations: { servicio: true } });
    const start = toMinutes(horario.horaInicio);
    const end = toMinutes(horario.horaFin);
    const duration = servicio.duracionMinutos;
    const free: string[] = [];
    for (let slot = start; slot + duration <= end; slot += 30) {
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

      const turno = manager.create(Turno, { ...dto, servicio: service, estado: EstadoTurno.PENDIENTE });
      return manager.save(Turno, turno);
    });
  }

  findAll(fecha?: string): Promise<Turno[]> {
    return this.repository.find({ where: fecha ? { fecha } : {}, relations: { servicio: true }, order: { fecha: 'ASC', hora: 'ASC' } });
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
}
