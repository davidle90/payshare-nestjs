import { User } from "../../../modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Expense } from "./expense.entity";

@Entity()
export class ExpenseParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expenseId: string;

  @ManyToOne(() => Expense, expense => expense.participants)
  expense: Expense;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amountOwed: number;
}
