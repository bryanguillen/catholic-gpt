import { IsString } from 'class-validator';

export class SaveUserMessageRequestDto {
  @IsString()
  message: string;
}
