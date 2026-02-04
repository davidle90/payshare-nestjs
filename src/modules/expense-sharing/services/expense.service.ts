import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from '../dto/requests/create-expense-dto';
import { UpdateExpenseDto } from '../dto/requests/update-expense-dto';
import { Expense, ExpenseStatus } from '../entities/expense.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EXPENSE_CHANGED_EVENT } from '../events/expense.events';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll({ groupId, search, includes, userId }: { groupId?: string, search?: string, includes?: string[], userId?: string }) {
        const qb = this.expenseRepository.createQueryBuilder('expense')
            .leftJoinAndSelect('expense.group', 'group');

        if (userId) {
            qb.innerJoin('group.members', 'member')
                .innerJoin('member.user', 'user')
                .andWhere('user.id = :userId', { userId });
        }

        if (includes?.includes('participants')) {
            qb.leftJoinAndSelect('expense.participants', 'participants');
        }

        if (includes?.includes('contributors')) {
            qb.leftJoinAndSelect('expense.contributors', 'contributors');
        }

        if(groupId) {
            qb.andWhere('group.referenceId = :groupId', { groupId });
        }

        if (search?.trim()) {
            qb.andWhere(
                '(expense.name ILIKE :search OR expense.referenceId ILIKE :search)',
                { search: `%${search.trim()}%` },
            );
        }

        qb.orderBy('expense.createdAt', 'DESC');

        return qb.getMany();
    }

    async findOne(referenceId: string, includes: string[] = []) {
        const relations = ['group']; // always load group
        if (includes.includes('participants')) relations.push('participants','participants.user');
        if (includes.includes('contributors')) relations.push('contributors','contributors.user');

        const expense = await this.expenseRepository.findOne({
            where: { referenceId },
            relations,
        });

        return expense;
    }

    async findById(id: string, includes: string[] = []) {
        const relations = ['group']; // always load group
        if (includes.includes('participants')) relations.push('participants');
        if (includes.includes('contributors')) relations.push('contributors');

        const expense = await this.expenseRepository.findOne({
            where: { id },
            relations,
        });

        return expense;
    }

    async findByReferenceId(referenceId: string, includes: string[] = []) {
        const relations = ['group']; // always load group
        if (includes.includes('participants')) relations.push('participants');
        if (includes.includes('contributors')) relations.push('contributors');

        const expense = await this.expenseRepository.findOne({
            where: { referenceId },
            relations,
        });

        return expense;
    }

    async create(input: CreateExpenseDto) {
        let referenceId: string;
        let exists: Expense | null;

        do {
            referenceId = generateReferenceId();
            exists = await this.expenseRepository.findOneBy({ referenceId });
        } while (exists);

        const expense = this.expenseRepository.create({
            ...input,
            referenceId
        });

        return await this.expenseRepository.save(expense);
    }

    async update(id: string, input: UpdateExpenseDto) {
        await this.expenseRepository.update(id, input)
        return this.expenseRepository.findOneBy({ id });
    }

    async delete(expense: Expense) {
        await this.expenseRepository.delete(expense.id);

        this.eventEmitter.emit(EXPENSE_CHANGED_EVENT, {
            groupId: expense.groupId
        });
        
        return { success: true };
    }

    async updateTotalAmount(expenseId: string) {
        const expense = await this.expenseRepository.findOne({
            where: { id: expenseId },
            relations: ['contributors'],
        });
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);

        let totalAmount = 0;

        for (const contributor of expense.contributors) {
            totalAmount += Number(contributor.amountPaid);
        }

        await this.expenseRepository.update(expenseId, { totalAmount });

        const updatedExpense = await this.expenseRepository.findOneBy({ id: expenseId });
        return updatedExpense;
    }

    async finalizeExpense(id: string) {
        const expense = await this.expenseRepository.findOne({
            where: { id },
            relations: ['participants', 'contributors'],
        });

        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        // if (expense.status === ExpenseStatus.FINALIZED) {
        //     return expense;
        // }

        const toCents = (v: string | number) => Math.round(Number(v) * 100);
        const totalOwed = expense.participants.reduce((s, p) => s + toCents(p.amountOwed), 0);
        const totalPaid = expense.contributors.reduce((s, c) => s + toCents(c.amountPaid), 0);

        if (totalOwed !== totalPaid) {
            throw new BadRequestException(
                `Cannot finalize expense: owed (${totalOwed}) ≠ paid (${totalPaid})`,
            );
        }

        const updatedExpense = await this.updateTotalAmount(expense.id);
        if(!updatedExpense) throw new HttpException('Updated expense not found', HttpStatus.NOT_FOUND)
        updatedExpense.status = ExpenseStatus.FINALIZED;

        await this.expenseRepository.save(updatedExpense);

        this.eventEmitter.emit(EXPENSE_CHANGED_EVENT, {
            groupId: updatedExpense.groupId
        });

        return updatedExpense;
    }
}

function generateReferenceId(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let reference = '';
  for (let i = 0; i < length; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
}
