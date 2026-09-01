import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@elvasco.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'una-clave-segura' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
