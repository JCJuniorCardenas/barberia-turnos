import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';
import { HorarioAtencion } from './entities/horario-atencion.entity.js';
import { DiaBloqueado } from './entities/dia-bloqueado.entity.js';
import { BloquearDiaDto } from './dto/bloquear-dia.dto.js';

@Injectable()
export class HorariosService implements OnModuleInit {
  constructor(
    @InjectRepository(HorarioAtencion)
    private readonly repository: Repository<HorarioAtencion>,
    @InjectRepository(DiaBloqueado)
    private readonly blockedDays: Repository<DiaBloqueado>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.repository.find({ select: { diaSemana: true } });
    const configuredDays = new Set(existing.map(({ diaSemana }) => diaSemana));
    const missing = Array.from({ length: 7 }, (_, diaSemana) => diaSemana)
      .filter((diaSemana) => !configuredDays.has(diaSemana))
      .map((diaSemana) => this.repository.create({ diaSemana, horaInicio: '09:00', horaFin: '18:00', cerrado: diaSemana === 0 }));
    if (missing.length) await this.repository.save(missing);
  }

  findAll(): Promise<HorarioAtencion[]> {
    return this.repository.find({ order: { diaSemana: 'ASC' } });
  }

  async updateByDay(diaSemana: number, dto: UpdateHorarioDto): Promise<HorarioAtencion> {
    const horario = await this.repository.findOneBy({ diaSemana });
    if (!horario) throw new NotFoundException(`No existe el día ${diaSemana}`);
    Object.assign(horario, dto);
    return this.repository.save(horario);
  }

  async findByDay(diaSemana: number): Promise<HorarioAtencion | null> {
    return this.repository.findOneBy({ diaSemana });
  }

  async isDayBlocked(fecha: string): Promise<boolean> {
    return Boolean(await this.blockedDays.findOneBy({ fecha }));
  }

  async findBlockedDays(): Promise<DiaBloqueado[]> {
    return this.blockedDays
      .createQueryBuilder('day')
      .where('day.fecha >= CURRENT_DATE')
      .orderBy('day.fecha', 'ASC')
      .getMany();
  }

  async blockDay(dto: BloquearDiaDto): Promise<DiaBloqueado> {
    const date = new Date(`${dto.fecha}T12:00:00-03:00`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dto.fecha) {
      throw new BadRequestException('Fecha inválida');
    }
    const existing = await this.blockedDays.findOneBy({ fecha: dto.fecha });
    if (existing) {
      existing.motivo = dto.motivo || null;
      return this.blockedDays.save(existing);
    }
    return this.blockedDays.save(this.blockedDays.create({ fecha: dto.fecha, motivo: dto.motivo || null }));
  }

  async unblockDay(fecha: string): Promise<void> {
    const result = await this.blockedDays.delete({ fecha });
    if (!result.affected) throw new NotFoundException('Día bloqueado no encontrado');
  }
}
