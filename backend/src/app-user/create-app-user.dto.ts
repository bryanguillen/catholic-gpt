import { IsString } from 'class-validator';

export class CreateAppUserDto {
  @IsString()
  userId: string;
}
