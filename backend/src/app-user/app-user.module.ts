import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from './app-user.entity';
import { AppUserController } from './app-user.controller';
import { AppUserService } from './app-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser])],
  controllers: [AppUserController],
  providers: [AppUserService],
})
export class AppUserModule {}
