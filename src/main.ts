import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
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
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  console.log(`App is running on: ${await app.getUrl()}`);
  

}
bootstrap();
