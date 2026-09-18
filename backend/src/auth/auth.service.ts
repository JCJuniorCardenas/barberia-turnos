import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto.js';
import { RolUsuario, Usuario } from './entities/usuario.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly users: Repository<Usuario>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.users.createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email: dto.email.toLowerCase() })
      .getOne();
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }
    return { access_token: await this.jwt.signAsync({ sub: user.id, email: user.email, rol: user.rol }) };
  }

  async createAdmin(email: string, password: string): Promise<Usuario> {
    const normalizedEmail = email.toLowerCase();
    let user = await this.users.findOneBy({ email: normalizedEmail });
    const passwordHash = await bcrypt.hash(password, 12);
    if (user) {
      user.password = passwordHash;
    } else {
      user = this.users.create({ email: normalizedEmail, password: passwordHash, rol: RolUsuario.ADMIN });
    }
    return this.users.save(user);
  }

  getSeedCredentials() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) throw new Error('Definí ADMIN_EMAIL y ADMIN_PASSWORD para ejecutar el seed');
    return { email, password };
  }
}
