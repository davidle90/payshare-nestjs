import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExpenseGroupMember } from "./expense-group-member.entity";
import { Expense } from "./expense.entity";
import { ExpenseDebt } from "./expense-debt.entity";

@Entity()
export class ExpenseGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    referenceId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    currency: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalExpenses: number;

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExpenseGroupMember, egm => egm.group, { cascade: true })
    members: ExpenseGroupMember[];

    @OneToMany(() => Expense, e => e.group, { cascade: true})
    expenses: Expense[];

    @OneToMany(() => ExpenseDebt, debt => debt.group, { cascade: true })
    debts: ExpenseDebt[];
}
