import {
  Entity,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';

@Entity('app_user')
export class AppUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Conversation, (conversation) => conversation.appUser)
  conversations: Conversation[];
}
