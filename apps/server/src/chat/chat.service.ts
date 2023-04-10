import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models';
import { CallbackManager } from 'langchain/callbacks';
import { Observable, Subscriber } from 'rxjs';
import { ChatMessageDto } from './chat.dto';
import { ConversationChain } from 'langchain/chains';
import { BufferWindowMemory } from 'langchain/memory';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';

@Injectable()
export class ChatService {
  private sessionMap = new Map<string, any>();

  sendMessage(data: ChatMessageDto) {
    let observer: Subscriber<string> = null;
    const observable = new Observable<string>((ob) => {
      observer = ob;

      const { chain } = this.getInstanceBySession(
        data,
        CallbackManager.fromHandlers({
          async handleLLMNewToken(token: string) {
            observer.next(token);
          },
        }),
      );

      chain.call({
        input: data.text,
      });
    });

    return observable;
  }

  // 判断数据是否有变化, 除了text之外的数据
  private isDataChange(a, b) {
    for (const [key, value] of Object.entries(a)) {
      if (key === 'text') {
        continue;
      }
      if (value !== b[key]) {
        return true;
      }
    }
    return false;
  }

  // 通过session获取缓存实例，因为保存上下文需要依赖同一个实例，而每次new的时候都会导致上下文丢失
  private getInstanceBySession(data: ChatMessageDto, callbackManager) {
    const sessionInstance = this.sessionMap.get(data.id);
    // 如果session存在且数据没有变化，直接返回session实例
    if (sessionInstance && !this.isDataChange(data, sessionInstance.data)) {
      // 重设一下callbackManager
      sessionInstance.model.callbackManager = callbackManager;
      return sessionInstance;
    }
    const model = new ChatOpenAI({
      openAIApiKey: data.openAIToken,
      streaming: true,
      callbackManager,
      ...data,
    });

    const prompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        data.systemPrompt +
          'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.',
      ),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const chain = new ConversationChain({
      memory: new BufferWindowMemory({
        returnMessages: true,
        memoryKey: 'history',
      }),
      prompt,
      llm: model,
    });

    const result = {
      model,
      prompt,
      chain,
      data,
    };
    this.sessionMap.set(data.id, result);

    return result;
  }
}
