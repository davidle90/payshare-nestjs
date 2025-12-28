import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExpenseGroup } from "./expense-group.entity";
import { User } from "../../../modules/users/entities/user.entity";

@Entity()
export class ExpenseGroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'member' })
  role: string; // 'admin' or 'member'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => ExpenseGroup, group => group.members, { onDelete: 'CASCADE' })
  group: ExpenseGroup;

  @ManyToOne(() => User, user => user.id)
  user: User;
}
