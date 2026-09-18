import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateEgresoDto {
  @ApiProperty({ example: 12000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto!: number;

  @ApiProperty({ example: 'Compra de productos de barbería' })
  @IsString()
  @MaxLength(200)
  concepto!: string;
}
