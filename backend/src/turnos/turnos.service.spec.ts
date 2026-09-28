import { BadRequestException, ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EstadoTurno } from './entities/turno.entity.js';
import { TurnosService } from './turnos.service.js';

function buildService(overrides?: {
  appointments?: Array<{ hora: string; estado: EstadoTurno; servicio: { duracionMinutos: number } }>;
  horario?: { horaInicio: string; horaFin: string; cerrado: boolean } | null;
  servicio?: { id: string; duracionMinutos: number; activo: boolean; precio: number; nombre: string };
  dayBlocked?: boolean;
}) {
  const servicio = overrides?.servicio ?? {
    id: 'servicio-1',
    duracionMinutos: 30,
    activo: true,
    precio: 1000,
    nombre: 'Corte',
  };

  const repository = {
    find: vi.fn().mockResolvedValue(overrides?.appointments ?? []),
    manager: {
      transaction: vi.fn(async (cb: (manager: unknown) => unknown) =>
        cb({
          query: vi.fn().mockResolvedValue(undefined),
          create: vi.fn((_entity, data) => data),
          save: vi.fn(async (_entity, data) => ({ id: 'turno-1', ...data })),
        }),
      ),
    },
  };

  const servicios = {
    findOne: vi.fn().mockResolvedValue(servicio),
  };

  const horarios = {
    isDayBlocked: vi.fn().mockResolvedValue(overrides?.dayBlocked ?? false),
    findByDay: vi.fn().mockResolvedValue(
      overrides?.horario === undefined
        ? { horaInicio: '09:00', horaFin: '18:00', cerrado: false }
        : overrides.horario,
    ),
  };

  const finanzas = { createIngreso: vi.fn() };

  const service = new TurnosService(repository as never, servicios as never, horarios as never, finanzas as never);
  return { service, repository, servicios, horarios };
}

describe('TurnosService', () => {
  const futureDate = '2099-06-15'; // martes

  beforeEach(() => {
    vi.useRealTimers();
  });

  describe('availableSlots', () => {
    it('devuelve slots vacíos si el día está bloqueado', async () => {
      const { service } = buildService({ dayBlocked: true });
      const slots = await service.availableSlots(futureDate, 'servicio-1');
      expect(slots).toEqual([]);
    });

    it('devuelve slots vacíos si el día está cerrado', async () => {
      const { service } = buildService({ horario: { horaInicio: '09:00', horaFin: '18:00', cerrado: true } });
      const slots = await service.availableSlots(futureDate, 'servicio-1');
      expect(slots).toEqual([]);
    });

    it('excluye horarios que se solapan con turnos existentes no cancelados', async () => {
      const { service } = buildService({
        appointments: [
          { hora: '09:00:00', estado: EstadoTurno.PENDIENTE, servicio: { duracionMinutos: 30 } },
        ],
      });
      const slots = await service.availableSlots(futureDate, 'servicio-1');
      expect(slots).not.toContain('09:00');
      expect(slots).toContain('09:30');
    });

    it('ignora turnos cancelados al calcular solapamiento', async () => {
      const { service } = buildService({
        appointments: [
          { hora: '09:00:00', estado: EstadoTurno.CANCELADO, servicio: { duracionMinutos: 30 } },
        ],
      });
      const slots = await service.availableSlots(futureDate, 'servicio-1');
      expect(slots).toContain('09:00');
    });

    it('rechaza una fecha con formato inválido', async () => {
      const { service } = buildService();
      await expect(service.availableSlots('15-06-2099', 'servicio-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('rechaza reservar un servicio inactivo', async () => {
      const { service } = buildService({
        servicio: { id: 'servicio-1', duracionMinutos: 30, activo: false, precio: 1000, nombre: 'Corte' },
      });
      await expect(
        service.create({ fecha: futureDate, hora: '10:00', servicioId: 'servicio-1', nombreCliente: 'Juan' } as never),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza un horario que ya no está disponible', async () => {
      const { service } = buildService({
        appointments: [
          { hora: '10:00:00', estado: EstadoTurno.PENDIENTE, servicio: { duracionMinutos: 30 } },
        ],
      });
      await expect(
        service.create({ fecha: futureDate, hora: '10:00', servicioId: 'servicio-1', nombreCliente: 'Juan' } as never),
      ).rejects.toThrow(ConflictException);
    });

    it('crea el turno cuando el horario está disponible', async () => {
      const { service } = buildService();
      const turno = await service.create({
        fecha: futureDate,
        hora: '10:00',
        servicioId: 'servicio-1',
        nombreCliente: 'Juan',
      } as never);
      expect(turno).toMatchObject({ fecha: futureDate, hora: '10:00', estado: EstadoTurno.PENDIENTE });
      expect(turno.codigoAcceso).toHaveLength(8);
    });
  });
});
