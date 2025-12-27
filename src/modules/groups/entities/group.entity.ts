import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { GroupMember } from './group-member.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => GroupMember, gm => gm.group)
  members: GroupMember[];
}
