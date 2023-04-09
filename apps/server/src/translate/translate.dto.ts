import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TranslateDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsString()
  @IsNotEmpty()
  prompt?: string;
}
