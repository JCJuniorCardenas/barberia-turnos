import { BadRequestException } from '@nestjs/common';

const TIMEZONE = 'America/Argentina/Buenos_Aires';

export const argentinaToday = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date());

export const argentinaDate = (fecha: string): Date => {
  const date = new Date(`${fecha}T12:00:00-03:00`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== fecha) {
    throw new BadRequestException('Fecha inválida');
  }
  return date;
};

export const argentinaNowMinutes = (): number => {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(values.hour) * 60 + Number(values.minute);
};
