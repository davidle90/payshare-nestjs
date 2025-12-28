import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExpenseGroupMember } from "./expense-group-member.entity";
import { Expense } from "./expense.entity";

@Entity()
export class ExpenseGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => ExpenseGroupMember, egm => egm.group)
    members: ExpenseGroupMember[];

    @OneToMany(() => Expense, e => e.group)
    expenses: Expense[];

    @Column({ default: 'active' })
    status: string;
}
