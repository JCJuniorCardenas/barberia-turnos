import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';
import { HorarioAtencion } from './entities/horario-atencion.entity.js';

@Injectable()
export class HorariosService implements OnModuleInit {
  constructor(
    @InjectRepository(HorarioAtencion)
    private readonly repository: Repository<HorarioAtencion>,
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
}
