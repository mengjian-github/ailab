import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/ssl/certs/ailab.fit.key'),
    cert: fs.readFileSync('/etc/ssl/certs/ailab.fit_bundle.crt'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  global.console = new Logger('console') as any;
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT || 3100);
}
bootstrap();
