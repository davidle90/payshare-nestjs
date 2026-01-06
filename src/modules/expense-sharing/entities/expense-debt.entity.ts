import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExpenseGroup } from "./expense-group.entity";
import { User } from "../../../modules/users/entities/user.entity";

@Entity()
@Index(['groupId', 'fromUserId', 'toUserId'], { unique: true })
export class ExpenseDebt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @Column({ nullable: true })
  fromUserId: string;

  @Column({ nullable: true })
  toUserId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ default: false })
  isSettled: boolean;

  @Column({ nullable: true })
  settledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ExpenseGroup, group => group.debts, { onDelete: 'CASCADE' })
  group: ExpenseGroup;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;
}
