import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './app-user.entity';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(AppUser) private appUserRepository: Repository<AppUser>,
  ) {}

  async createAppUser(userId: string): Promise<AppUser> {
    const appUser = new AppUser();
    appUser.id = userId;
    return this.appUserRepository.save(appUser);
  }

  async getAppUser(userId: string): Promise<AppUser> {
    return await this.appUserRepository.findOne({ where: { id: userId } });
  }
}
