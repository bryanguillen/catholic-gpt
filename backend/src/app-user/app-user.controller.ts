import { Controller, Post } from '@nestjs/common';
import { AppUserService } from './app-user.service';

@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  async createAppUser() {
    const appUser = await this.appUserService.createAppUser();
    return { id: appUser.id };
  }
}
