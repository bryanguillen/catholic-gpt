import { IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  appUserId: string;

  @IsString()
  message: string;
}
