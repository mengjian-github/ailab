import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatMessageDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  chat(@Body() data: ChatMessageDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // 发送这些头信息到客户端

    const observable = this.chatService.sendMessage(data);
    observable.subscribe((token) => {
      res.write(`${token}`);
    });
  }
}
