import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslateController } from './translate/translate.controller';
import { TranslateService } from './translate/translate.service';
import { APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { UploadController } from './upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../web', 'out'),
    }),
    MulterModule.register({
      dest: './.uploads',
    }),
  ],
  controllers: [
    AppController,
    TranslateController,
    ChatController,
    UploadController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
    TranslateService,
    ChatService,
  ],
})
export class AppModule {}
