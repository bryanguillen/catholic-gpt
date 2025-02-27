import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export enum SenderType {
  ASSISTANT = 'assistant',
  USER = 'user',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({
    // todo: change to enum; use text for now for testing with sqlite
    type: 'text',
    name: 'sender_type',
  })
  senderType: SenderType;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text')
  content: string;
}
