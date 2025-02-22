import { Controller, Post, Body } from '@nestjs/common';
import { AppUserService } from './app-user.service';

@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  createAppUser(@Body() userId: string) {
    return this.appUserService.createAppUser(userId);
  }
}
