import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { ExpenseContributor } from "./expense-contributor.entity";
import { ExpenseGroup } from "./expense-group.entity";
import { ExpenseParticipant } from "./expense-participant.entity";
import { User } from "../../../modules/users/entities/user.entity";

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @ManyToOne(() => ExpenseGroup, group => group.expenses)
  group: ExpenseGroup;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  currency: string;

  @Column({ default: false })
  isSettled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ExpenseContributor, c => c.expense)
  contributors: ExpenseContributor[];

  @OneToMany(() => ExpenseParticipant, p => p.expense)
  participants: ExpenseParticipant[];

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
