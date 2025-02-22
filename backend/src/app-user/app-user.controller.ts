import { Controller, Post, Body } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './create-app-user.dto';

@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  async createAppUser(@Body() body: CreateAppUserDto) {
    const appUser = await this.appUserService.createAppUser(body.userId);
    return { id: appUser.id };
  }
}
