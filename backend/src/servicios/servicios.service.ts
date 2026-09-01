import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';
import { Servicio } from './entities/servicio.entity.js';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
  ) {}

  create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    const servicio = this.serviciosRepository.create(createServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  findAll(): Promise<Servicio[]> {
    return this.serviciosRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOneBy({ id });
    if (!servicio) {
      throw new NotFoundException(`No se encontró el servicio ${id}`);
    }
    return servicio;
  }

  async update(id: string, updateServicioDto: UpdateServicioDto): Promise<Servicio> {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviciosRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`No se encontró el servicio ${id}`);
    }
  }
}
