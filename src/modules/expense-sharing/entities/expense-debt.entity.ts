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

  @Column()
  fromUserId: string;

  @Column()
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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;
}
