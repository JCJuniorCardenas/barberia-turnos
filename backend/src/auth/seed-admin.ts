import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { AuthService } from './auth.service.js';

const app = await NestFactory.createApplicationContext(AppModule);
const auth = app.get(AuthService);
const { email, password } = auth.getSeedCredentials();
await auth.createAdmin(email, password);
console.log(`Usuario administrador creado/actualizado: ${email}`);
await app.close();
