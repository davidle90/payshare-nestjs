import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, JoinColumn, UpdateDateColumn } from "typeorm";
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

  @Column()
  name: string;

  @Column()
  description: string;
  
  @Column()
  currency: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: false })
  isSettled: boolean;

  @Column({ nullable: true })
  editedByUserId?: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ExpenseGroup, group => group.expenses)
  group: ExpenseGroup;
  
  @ManyToOne(() => User)
  @JoinColumn()
  createdByUser: User;
  
  @OneToMany(() => ExpenseContributor, c => c.expense)
  contributors: ExpenseContributor[];

  @OneToMany(() => ExpenseParticipant, p => p.expense)
  participants: ExpenseParticipant[];
}
