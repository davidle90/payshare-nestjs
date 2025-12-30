import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, JoinColumn, UpdateDateColumn } from "typeorm";
import { ExpenseContributor } from "./expense-contributor.entity";
import { ExpenseGroup } from "./expense-group.entity";
import { ExpenseParticipant } from "./expense-participant.entity";
import { User } from "../../../modules/users/entities/user.entity";

export enum ExpenseStatus {
  DRAFT = 'draft',
  FINALIZED = 'finalized',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @Column()
  referenceId: string;

  @Column()
  name: string;

  @Column()
  description: string;
  
  @Column()
  currency: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({default: 'draft'})
  status: ExpenseStatus;

  @Column({ default: false })
  isSettled: boolean;

  @Column({ nullable: true })
  editedByUserId?: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ExpenseGroup, group => group.expenses, { onDelete: 'CASCADE'})
  group: ExpenseGroup;
  
  @ManyToOne(() => User)
  @JoinColumn()
  createdByUser: User;
  
  @OneToMany(() => ExpenseContributor, c => c.expense, { cascade: true })
  contributors: ExpenseContributor[];

  @OneToMany(() => ExpenseParticipant, p => p.expense, { cascade: true })
  participants: ExpenseParticipant[];
}
