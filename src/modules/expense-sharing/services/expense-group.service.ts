import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseGroupDto } from '../dto/create-expense-group-dto';
import { ExpenseGroup } from '../entities/expense-group.entity';
import { UpdateExpenseGroupDto } from '../dto/update-expense-group-dto';
import { ExpenseDebt } from '../entities/expense-debt.entity';

type BalanceMap = Record<string, Record<string, number>>;

interface Transaction {
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

    async findAll({ search, includes }: { search?: string, includes?: string[] }) {
        const qb = this.groupRepository.createQueryBuilder('expenseGroup');

        if (includes?.includes('members')) {
            qb.leftJoinAndSelect('expenseGroup.members', 'members');
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

    async updateTotalExpenses(group: ExpenseGroup) {
        let totalExpenses = 0;

        for (const expense of group.expenses) {
            totalExpenses += Number(expense.totalAmount);
        }

        await this.groupRepository.update(group.id, { totalExpenses });
    }

    async calculateBalance(group: ExpenseGroup): Promise<BalanceMap> {
        const debts: BalanceMap = {};
        const balance: BalanceMap = {};

        // Step 1: Calculate debts in memory
        for (const expense of group.expenses) {
            const participantsWithoutExpenses = expense.participants.filter(p => p.amountOwed === 0);
            const participantsWithExpenses = expense.participants.filter(p => p.amountOwed > 0);

            if (!participantsWithoutExpenses.length) continue;

            const totalOwed = participantsWithExpenses.reduce(
                (sum, p) => sum + Number(p.amountOwed),
                0,
            );

            for (const contributor of expense.contributors) {
                const debtPerMember = (Number(contributor.amountPaid) - totalOwed) / participantsWithoutExpenses.length;

                // Debts to participants without expenses
                for (const participant of participantsWithoutExpenses) {
                    if (participant.memberId === contributor.memberId) continue;

                    debts[participant.memberId] ??= {};
                    debts[participant.memberId][contributor.memberId] ??= 0;
                    debts[participant.memberId][contributor.memberId] += debtPerMember;
                }

                // Debts to participants with expenses
                for (const participant of participantsWithExpenses) {
                    if (participant.memberId === contributor.memberId) continue;

                    debts[participant.memberId] ??= {};
                    debts[participant.memberId][contributor.memberId] ??= 0;
                    debts[participant.memberId][contributor.memberId] += Number(participant.amountOwed);
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

    async simplifyTransactions(group: ExpenseGroup): Promise<Transaction[]> {
        const balance = await this.calculateBalance(group);
        return simplifyBalance(balance);
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

function simplifyBalance(balance: BalanceMap): Transaction[] {
    const transactions: Transaction[] = [];
    const processed = new Set<string>(); // avoid double-processing

    const members = Object.keys(balance);

    for (const from of members) {
        for (const to of members) {
        if (from === to) continue;

        const key = [from, to].sort().join('-'); // unique pair
        if (processed.has(key)) continue;

        const fromTo = balance[from][to] || 0;
        const toFrom = balance[to][from] || 0;

        const netAmount = fromTo - toFrom;

        transactions.push({
            from,
            to,
            amount: netAmount > 0 ? netAmount : 0,
        });

        processed.add(key);
        }
    }

    return transactions;
}
