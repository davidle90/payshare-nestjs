import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExpenseDebt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @Column()
  fromUserId: string;

  @Column()
  toUserId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
