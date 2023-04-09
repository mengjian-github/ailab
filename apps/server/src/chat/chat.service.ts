import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CallbackManager } from 'langchain/callbacks';
import { Observable, Subscriber } from 'rxjs';
import { ChatMessageDto } from './chat.dto';

@Injectable()
export class ChatService {
  sendMessage(data: ChatMessageDto) {
    let observer: Subscriber<string> = null;
    const observable = new Observable<string>((ob) => {
      observer = ob;
    });
    const chatStreaming = new ChatOpenAI({
      openAIApiKey: data.openAIToken,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token: string) {
          observer.next(token);
        },
      }),
      ...data,
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 100,
    });
    splitter.createDocuments([data.text]).then(async (docs) => {
      for (const doc of docs) {
        const messages = [];

        if (data.systemPrompt) {
          messages.push(new SystemChatMessage(data.systemPrompt));
        }

        messages.push(new HumanChatMessage(doc.pageContent));
        await chatStreaming.call(messages);
      }
    });

    return observable;
  }
}
