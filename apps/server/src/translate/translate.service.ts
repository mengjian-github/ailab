import { Injectable, MessageEvent } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { TranslateDto } from './translate.dto';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CallbackManager } from 'langchain/callbacks';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class TranslateService {
  translate(data: TranslateDto) {
    let observer: Subscriber<string> = null;
    const observable = new Observable<string>((ob) => {
      observer = ob;
    });
    const chatStreaming = new ChatOpenAI({
      openAIApiKey: data.token,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token: string) {
          observer.next(token);
        },
      }),
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 100,
    });
    splitter.createDocuments([data.text]).then(async (docs) => {
      for (const doc of docs) {
        await chatStreaming.call([
          new SystemChatMessage('You are a helpful assistant for translating.'),
          new HumanChatMessage(data.prompt + doc.pageContent),
        ]);
      }
    });

    return observable;
  }
}
