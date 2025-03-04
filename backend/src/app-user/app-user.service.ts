import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './app-user.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(AppUser) private appUserRepository: Repository<AppUser>,
    private readonly logger: LoggerService,
  ) {}

  async createAppUser(): Promise<AppUser> {
    try {
      const appUser = new AppUser();
      return await this.appUserRepository.save(appUser);
    } catch (error) {
      this.logger.error('Error creating app user', 'AppUserService', { error });
      throw error;
    }
  }

  async getAppUser(userId: string): Promise<AppUser> {
    try {
      return await this.appUserRepository.findOne({ where: { id: userId } });
    } catch (error) {
      this.logger.error('Error getting app user', 'AppUserService', { error });
      throw error;
    }
  }
}
