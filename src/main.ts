import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //     new ValidationPipe({
  //       whitelist: true,
  //       forbidNonWhitelisted: true,
  //       transform: true,
  //       transformOptions: {
  //         enableImplicitConversion: true,
  //       },
  //     }),
  // );
  await app.listen(3000);
  console.log(`App is running on: ${await app.getUrl()}`);
  

}
bootstrap();
