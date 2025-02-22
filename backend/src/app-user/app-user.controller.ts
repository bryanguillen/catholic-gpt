import { Controller, Post, Body } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './create-app-user.dto';

@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  createAppUser(@Body() body: CreateAppUserDto) {
    return this.appUserService.createAppUser(body.userId);
  }
}
