import { User } from "../../../modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Expense } from "./expense.entity";

@Entity()
export class ExpenseContributor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expenseId: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Expense, expense => expense.contributors)
  expense: Expense;
}
