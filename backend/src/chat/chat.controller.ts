import { Controller, Post } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Post()
  async getResponse() {
    return 'Hello World';
  }
}
