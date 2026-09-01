import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class ListTurnosDto {
  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha?: string;
}
