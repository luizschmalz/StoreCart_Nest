import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não listadas no DTO
      forbidNonWhitelisted: true, // lança erro se propriedade não for reconhecida
      transform: true, // transforma tipos primitivos automaticamente (ex: string -> number)
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('StoreCart API')
    .setDescription(
      'Description of all routes and schemas in the StoreCart API',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
