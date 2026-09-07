import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import dataSource from './data-source.js';

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
  app.enableCors();
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

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
