import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches, MaxLength, IsString } from 'class-validator';

export class BloquearDiaDto {
  @ApiProperty({ example: '2026-12-24' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;

  @ApiPropertyOptional({ example: 'Vacaciones' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  motivo?: string;
}
