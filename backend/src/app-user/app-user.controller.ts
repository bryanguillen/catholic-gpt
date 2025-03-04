import { Controller, Post } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { LoggerService } from '../logger/logger.service';

@Controller('app-user')
export class AppUserController {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async createAppUser() {
    this.logger.log('Creating app user', 'AppUserController');

    const appUser = await this.appUserService.createAppUser();

    this.logger.log(`App user created: ${appUser.id}`, 'AppUserController');

    return { id: appUser.id };
  }
}
