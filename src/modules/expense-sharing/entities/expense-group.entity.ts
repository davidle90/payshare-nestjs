import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExpenseGroupMember } from "./expense-group-member.entity";
import { Expense } from "./expense.entity";

@Entity()
export class ExpenseGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExpenseGroupMember, egm => egm.group)
    members: ExpenseGroupMember[];

    @OneToMany(() => Expense, e => e.group)
    expenses: Expense[];
}
