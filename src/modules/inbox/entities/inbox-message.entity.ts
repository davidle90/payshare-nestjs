import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class InboxMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  message: string;

  @Column()
  status: 'new' | 'handled';

  @CreateDateColumn()
  createdAt: Date;
}
