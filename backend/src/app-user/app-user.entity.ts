import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';

@Entity()
export class AppUser {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => Conversation, (conversation) => conversation.appUser)
  conversations: Conversation[];
}
