import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpenseDebt } from "../entities/expense-debt.entity";
import { Repository } from "typeorm";
import { ExpenseGroup } from "../entities/expense-group.entity";
import { Expense } from "../entities/expense.entity";

@Injectable()
export class ExpenseDebtService {
    constructor(
        @InjectRepository(ExpenseDebt) private readonly debtRepository: Repository<ExpenseDebt>,
        @InjectRepository(ExpenseGroup) private readonly groupRepository: Repository<ExpenseGroup>,
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
    ) {}

    async findByGroupId(groupId: string) {
        return await this.debtRepository.find({ where: { groupId }, relations: ['fromUser', 'toUser'] });
    }

    async findByUserId(fromUserId: string) {
        return await this.debtRepository.find({
            where: {
                fromUserId,
            },
            relations: ['fromUser', 'toUser', 'group', 'group.members'],
        })
        // .then(debts => {
        //     return debts.filter(debt => 
        //         debt.group?.members?.some(member => member.id === fromUserId)
        //     );
        // });
    }

    async settleUpByGroupId(groupId: string) {
        const group = await this.groupRepository.findOne({ where: { id: groupId }, relations: ['expenses', 'debts']});
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        for (const expense of group.expenses) {
            if (expense.status !== 'finalized' || expense.isSettled) continue;
            await this.expenseRepository.update(expense.id, { isSettled: true });
        }

        for (const debt of group.debts) {
            if (!debt.isSettled) {
                await this.debtRepository.update(debt.id, { isSettled: true });
            }
        }

        return { success: true }
    }
}