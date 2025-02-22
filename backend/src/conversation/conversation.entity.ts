import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AppUser } from '../app-user/app-user.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AppUser, (appUser) => appUser.conversations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'app_user_id' })
  appUser: AppUser;

  @CreateDateColumn()
  createdAt: Date;
}
