import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3002', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['content-type', 'authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth() // optional, for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs/v1', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
