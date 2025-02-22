import { IsString } from 'class-validator';

export class SendMessageRequestDto {
  @IsString()
  appUserId: string;

  @IsString()
  message: string;
}
