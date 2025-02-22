import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';

@Entity('app_user')
export class AppUser {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => Conversation, (conversation) => conversation.appUser)
  conversations: Conversation[];
}
