import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Autochek API')
    .setDescription('Vehicle Valuation and Financing Services API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description:
          'Paste ONLY the token here — no need to include "Bearer".',
      },
      'access-token',
    )
    .addTag('authentication')
    .addTag('vehicles')
    .addTag('valuations')
    .addTag('loans')
    .addTag('offers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚗 App running at http://localhost:${port}`);
  console.log(`📘 Swagger docs at http://localhost:${port}/api-docs`);
}
bootstrap();
