import { User } from "../../../modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Expense } from "./expense.entity";

@Entity()
export class ExpenseParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expenseId: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amountOwed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => Expense, expense => expense.participants)
  expense: Expense;
  
  @ManyToOne(() => User, user => user.id)
  user: User;
}
