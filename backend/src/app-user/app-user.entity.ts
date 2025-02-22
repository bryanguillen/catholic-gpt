import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AppUser {
  @PrimaryColumn('uuid')
  id: string;
}
