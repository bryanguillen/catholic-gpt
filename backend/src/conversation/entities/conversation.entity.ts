import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { AppUser } from '../../app-user/app-user.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'thread_id' })
  threadId: string;

  @ManyToOne(() => AppUser, (appUser) => appUser.conversations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'app_user_id' })
  appUser: AppUser;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
