import { User } from "../../../modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Expense } from "./expense.entity";
import { ExpenseGroupMember } from "./expense-group-member.entity";

@Entity()
@Index(['expenseId', 'memberId'], { unique: true })
export class ExpenseParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expenseId: string;

  @Column()
  memberId: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amountOwed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => Expense, expense => expense.participants, { onDelete: 'CASCADE' })
  expense: Expense;

  @ManyToOne(() => ExpenseGroupMember, member => member.id)
  member: ExpenseGroupMember;
  
  @ManyToOne(() => User, user => user.id)
  user: User;
}
