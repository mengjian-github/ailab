import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChatMessageDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsNotEmpty()
  @IsString()
  openAIToken: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  topP: number;

  @IsNumber()
  frequencyPenalty: number;

  @IsNumber()
  presencePenalty: number;

  @IsNumber()
  n: number;

  @IsString()
  modelName: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsArray()
  @IsOptional()
  stop?: string[];

  @IsNumber()
  @IsOptional()
  timeout?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @IsBoolean()
  @IsOptional()
  isAbstract?: boolean;

  @IsString()
  @IsOptional()
  extraDataUrl?: string;

  @IsArray()
  messageList: Array<any>;
}
