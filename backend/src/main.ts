import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import dataSource from './data-source.js';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    try {
      await dataSource.initialize();
      const migrations = await dataSource.runMigrations();
      console.log(`Migraciones aplicadas: ${migrations.length}`);
    } catch (error) {
      console.error('No se pudieron aplicar las migraciones. El backend no iniciará.', error);
      throw error;
    } finally {
      if (dataSource.isInitialized) await dataSource.destroy();
    }
  }
  const app = await NestFactory.create(AppModule);
  const corsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (corsOrigins.length === 0) {
    logger.warn(
      'CORS_ORIGIN no está configurado: se aceptará cualquier origen. Definilo en producción.',
    );
  }
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API El Vasco')
    .setDescription('API para la gestión de turnos de barbería')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerConfig));

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Servidor escuchando en el puerto ${port}`);
}
await bootstrap();
