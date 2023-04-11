import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models';
import { CallbackManager } from 'langchain/callbacks';
import { Observable, Subscriber } from 'rxjs';
import { ChatMessageDto } from './chat.dto';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import {
  CheerioWebBaseLoader,
  GithubRepoLoader,
  PDFLoader,
  TextLoader,
} from 'langchain/document_loaders';
import * as fs from 'fs';
import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';

import * as crypto from 'crypto';
import { OpenAIChat } from 'langchain/llms';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';

// 提问模板
const questionGeneratorTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question(use chinese).

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

// 回答模板
const qaTemplate = `Use the following pieces of context to answer the question at the end(use chinese)

{context}

Question: {question}
Helpful Answer:`;

@Injectable()
export class ChatService {
  sendMessage(data: ChatMessageDto) {
    let observer: Subscriber<string> = null;
    const observable = new Observable<string>((ob) => {
      observer = ob;

      const callbackManager = CallbackManager.fromHandlers({
        async handleLLMNewToken(token: string) {
          observer.next(token);
        },
      });

      if (data.extraDataUrl || data.filename || data.extraDataGithub) {
        this.qaWithContent(data, callbackManager);
      } else {
        this.chat(data, callbackManager);
      }
    });

    return observable;
  }

  private async chat(data: ChatMessageDto, callbackManager: CallbackManager) {
    const model = new ChatOpenAI({
      streaming: true,
      openAIApiKey: data.openAIToken,
      callbackManager,
      ...data,
    });

    model.call([
      new SystemChatMessage(
        'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.',
      ),
      ...data.messageList.map((m) => {
        if (m.type === 0) {
          return new HumanChatMessage(m.text);
        }
        return new AIChatMessage(m.text);
      }),
      new HumanChatMessage(data.text),
    ]);
  }

  private async qaWithContent(
    data: ChatMessageDto,
    callbackManager: CallbackManager,
  ) {
    let loader;
    if (data.filename) {
      loader = data.fileMimeType.includes('pdf')
        ? new PDFLoader('./.uploads/' + data.filename, {
            pdfjs: () => import('pdfjs-dist/legacy/build/pdf.js'),
          })
        : new TextLoader('./.uploads/' + data.filename);
    } else if (data.extraDataGithub) {
      loader = new GithubRepoLoader(data.extraDataGithub, {
        accessToken: data.githubToken,
      });
    } else {
      loader = new CheerioWebBaseLoader(data.extraDataUrl);
    }
    const docs = await loader.loadAndSplit();

    const path =
      './.store/' +
      crypto
        .createHash('md5')
        .update(data.filename || data.extraDataGithub || data.extraDataUrl)
        .digest('hex');

    let vectorStore;
    if (fs.existsSync(path)) {
      vectorStore = await HNSWLib.load(
        path,
        new OpenAIEmbeddings({ openAIApiKey: data.openAIToken }),
      );
    } else {
      vectorStore = await HNSWLib.fromDocuments(
        docs,
        new OpenAIEmbeddings({ openAIApiKey: data.openAIToken }),
      );
      await vectorStore.save(path);
    }

    const model = new OpenAIChat({
      streaming: true,
      openAIApiKey: data.openAIToken,
      callbackManager,
      ...data,
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        qaTemplate,
        questionGeneratorTemplate,
      },
    );

    chain.call({
      question: data.text,
      chat_history: data.messageList.map((m) => m.text),
    });
  }
}
