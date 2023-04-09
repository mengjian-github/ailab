import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  global.console = new Logger('console') as any;
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT || 3100);
}
bootstrap();
