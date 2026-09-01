import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';
import { Servicio } from './entities/servicio.entity.js';
import { ServiciosService } from './servicios.service.js';

@ApiTags('servicios')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @SkipThrottle()
  @ApiOperation({ summary: 'Crear un servicio' })
  @ApiResponse({ status: 201, type: Servicio })
  create(@Body() createServicioDto: CreateServicioDto): Promise<Servicio> {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Listar servicios' })
  @ApiResponse({ status: 200, type: [Servicio] })
  findAll(): Promise<Servicio[]> {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  @SkipThrottle()
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  findOne(@Param('id') id: string): Promise<Servicio> {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  @SkipThrottle()
  @ApiOperation({ summary: 'Actualizar un servicio' })
  update(
    @Param('id') id: string,
    @Body() updateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @Delete(':id')
  @SkipThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un servicio' })
  remove(@Param('id') id: string): Promise<void> {
    return this.serviciosService.remove(id);
  }
}
