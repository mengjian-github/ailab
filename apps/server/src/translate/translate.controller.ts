import { Body, Controller, MessageEvent, Post, Res } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateDto } from './translate.dto';
import { Response } from 'express';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  translate(@Body() data: TranslateDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // 发送这些头信息到客户端

    const observable = this.translateService.translate(data);
    observable.subscribe((token) => {
      res.write(`${token}`);
    });
  }
}
