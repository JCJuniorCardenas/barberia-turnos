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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AdminGuard } from '../auth/admin.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
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
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un servicio' })
  @ApiResponse({ status: 201, type: Servicio })
  create(@Body() createServicioDto: CreateServicioDto): Promise<Servicio> {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Listar servicios' })
  @ApiResponse({ status: 200, type: [Servicio] })
  findAll(@Query('incluirInactivos') incluirInactivos?: string): Promise<Servicio[]> {
    return this.serviciosService.findAll(incluirInactivos === 'true');
  }

  @Get(':id')
  @SkipThrottle()
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  findOne(@Param('id') id: string): Promise<Servicio> {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  @SkipThrottle()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un servicio' })
  update(
    @Param('id') id: string,
    @Body() updateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @Delete(':id')
  @SkipThrottle()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un servicio' })
  remove(@Param('id') id: string): Promise<void> {
    return this.serviciosService.remove(id);
  }
}
