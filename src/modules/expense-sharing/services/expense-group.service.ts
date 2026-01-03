import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseGroupDto } from '../dto/requests/create-expense-group-dto';
import { ExpenseGroup } from '../entities/expense-group.entity';
import { UpdateExpenseGroupDto } from '../dto/requests/update-expense-group-dto';
import { ExpenseDebt } from '../entities/expense-debt.entity';
import { ExpenseStatus } from '../entities/expense.entity';

type BalanceMap = Record<string, Record<string, number>>;

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

@Injectable()
export class ExpenseGroupService {
    constructor(
        @InjectRepository(ExpenseGroup) private readonly groupRepository: Repository<ExpenseGroup>,
        @InjectRepository(ExpenseDebt) private readonly debtRepository: Repository<ExpenseDebt>,
    ) {}

    async findAll({ userId, search, includes }: { userId: string, search?: string, includes?: string[] }) {
        const qb = this.groupRepository
            .createQueryBuilder('expenseGroup')
            .where(qb => {
                const subQuery = qb
                .subQuery()
                .select('1')
                .from('expense_group_member', 'm')
                .where('m.groupId = expenseGroup.id')
                .andWhere('m.userId = :userId')
                .getQuery();

                return `EXISTS ${subQuery}`;
            })
            .setParameter('userId', userId);

        qb.leftJoinAndSelect('expenseGroup.members', 'members');

        if (includes?.includes('members')) {
        qb.leftJoinAndSelect('members.user', 'user');
        }

        if (includes?.includes('expenses')) {
            qb.leftJoinAndSelect('expenseGroup.expenses', 'expenses');
        }
        
        if (includes?.includes('debts')) {
            qb.leftJoinAndSelect('expenseGroup.debts', 'debts');
        }

        if (search?.trim()) {
            qb.andWhere(
            '(expenseGroup.name ILIKE :search OR expenseGroup.referenceId ILIKE :search)',
            { search: `%${search.trim()}%` },
            );
        }

        qb.orderBy('expenseGroup.createdAt', 'DESC');

        return qb.getMany();
    }

    async findOne(referenceId: string, includes: string[] = []) {
        const qb = this.groupRepository.createQueryBuilder('expenseGroup');

        qb.where('expenseGroup.referenceId = :referenceId', { referenceId })

        if (includes.includes('members')) {
            qb.leftJoinAndSelect('expenseGroup.members', 'members');
            qb.leftJoinAndSelect('members.user', 'user');
        }
        if (includes.includes('expenses')) {
            qb.leftJoinAndSelect('expenseGroup.expenses', 'expenses');
        }
        if (includes.includes('debts')) {
            qb.leftJoinAndSelect('expenseGroup.debts', 'debts');
        }

        return await qb.getOne();
    }

    async create(input: CreateExpenseGroupDto) {
        let referenceId: string;
        let exists: ExpenseGroup | null;

        do {
            referenceId = generateReferenceId();
            exists = await this.groupRepository.findOneBy({ referenceId });
        } while (exists);

        const group = this.groupRepository.create({
            ...input,
            referenceId
        });

        return await this.groupRepository.save(group);
    }

    async update(id: string, input: UpdateExpenseGroupDto) {
        await this.groupRepository.update(id, input);
        const group = await this.groupRepository.findOneBy({ id })
        if (!group) throw new NotFoundException('Group not found');

        return group;
    }

    async delete(id: string) {
        return await this.groupRepository.delete(id);
    }

    async updateTotalExpenses(groupId: string) {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: ['expenses'],
        });

        if (!group) throw new NotFoundException('Group not found');

        let totalExpenses = 0;

        for (const expense of group.expenses) {
            if (expense.status === ExpenseStatus.FINALIZED) {
                totalExpenses += Number(expense.totalAmount);
            }
        }

        await this.groupRepository.update(group.id, { totalExpenses });
    }

    async calculateBalance(groupId: string): Promise<BalanceMap> {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: [
                'expenses',
                'expenses.participants',
                'expenses.contributors',
            ],
        });

        if (!group) throw new NotFoundException('Group not found');

        const debts: BalanceMap = {};
        const balance: BalanceMap = {};

        // Step 1: Calculate debts in memory
        for (const expense of group.expenses) {
            if(expense.status !== ExpenseStatus.FINALIZED)
                continue;

            for (const participant of expense.participants) {
                const fromUserId = participant.userId;

                for (const contributor of expense.contributors) {
                    const toUserId = contributor.userId
                    if (fromUserId === toUserId) continue;

                    debts[fromUserId] ??= {};
                    debts[fromUserId][toUserId] ??= 0;
                    debts[fromUserId][toUserId] += Number(participant.amountOwed);
                }
            }
        }

        // Step 2: Calculate net balances
        for (const fromId in debts) {
            for (const toId in debts[fromId]) {
                if (fromId === toId) continue;

                balance[fromId] ??= {};
                balance[toId] ??= {};

                balance[fromId][toId] ??= 0;
                balance[toId][fromId] ??= 0;

                balance[fromId][toId] += debts[fromId][toId];
                balance[toId][fromId] -= debts[fromId][toId];
            }
        }

        // Step 3: Prepare batch DB updates
        const debtEntities: Partial<ExpenseDebt>[] = [];
        for (const fromId in balance) {
            for (const toId in balance[fromId]) {
                if (fromId === toId) continue;

                debtEntities.push({
                    groupId: group.id,
                    fromUserId: fromId,
                    toUserId: toId,
                    amount: balance[fromId][toId],
                });
            }
        }

        // Step 4: Batch create or update to DB
        await this.debtRepository
            .createQueryBuilder()
            .insert()
            .into(ExpenseDebt)
            .values(debtEntities)
            .orUpdate(
                ['amount'], // columns to update if conflict
                ['groupId', 'fromUserId', 'toUserId'], // unique constraint
            )
            .execute();

        return balance;
    }

    async simplifyBalance(groupId: string): Promise<Transaction[]> {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: ['expenses'],
        });

        if (!group) throw new NotFoundException('Group not found');

        const balance = await this.calculateBalance(group.id);
        return simplify(balance);
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

function simplify(balance: BalanceMap): Transaction[] {
    const net: Record<string, number> = {};

    // 1. Compute net balance (SIGNED balances — no double counting)
    for (const from in balance) {
        net[from] ??= 0;
        for (const to in balance[from]) {
            net[from] += balance[from][to];
        }
    }

    // 2. Separate debtors & creditors
    const debtors = Object.entries(net).filter(([, v]) => v < 0);
    const creditors = Object.entries(net).filter(([, v]) => v > 0);

    const result: Transaction[] = [];
    let i = 0, j = 0;

    // 3. Match debtors to creditors (minimal transactions)
    while (i < debtors.length && j < creditors.length) {
        const [debtor, debt] = debtors[i];
        const [creditor, credit] = creditors[j];

        const amount = Math.min(-debt, credit);

        result.push({
            from: debtor,
            to: creditor,
            amount
        });

        debtors[i][1] += amount;
        creditors[j][1] -= amount;

        if (debtors[i][1] === 0) i++;
        if (creditors[j][1] === 0) j++;
    }

    return result;
}
