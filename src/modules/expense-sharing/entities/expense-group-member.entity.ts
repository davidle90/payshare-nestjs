import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExpenseGroup } from "./expense-group.entity";
import { User } from "../../../modules/users/entities/user.entity";

@Entity()
export class ExpenseGroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @ManyToOne(() => ExpenseGroup, group => group.members)
  group: ExpenseGroup;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ default: 'member' })
  role: string; // 'admin' or 'member'
}
