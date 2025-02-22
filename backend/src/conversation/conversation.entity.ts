import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AppUser } from '../app-user/app-user.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AppUser, (appUser) => appUser.conversations, {
    onDelete: 'CASCADE',
  })
  appUser: AppUser;
}
