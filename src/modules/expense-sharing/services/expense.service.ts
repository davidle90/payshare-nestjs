import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from '../dto/requests/create-expense-dto';
import { UpdateExpenseDto } from '../dto/requests/update-expense-dto';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
    ) {}

    async findAll({ groupId, search, includes }: { groupId?: string, search?: string, includes?: string[] }) {
        const qb = this.expenseRepository.createQueryBuilder('expense')
            .leftJoinAndSelect('expense.group', 'group');

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
        const qb = this.expenseRepository.createQueryBuilder('expense');

        qb.where('expense.referenceId = :referenceId', { referenceId })
            .leftJoinAndSelect('expense.group', 'group')

        if (includes.includes('participants')) {
            qb.leftJoinAndSelect('expense.participants', 'participants');
        }
        if (includes.includes('contributors')) {
            qb.leftJoinAndSelect('expense.contributors', 'contributors');
        }

        return await qb.getOne();
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

    async delete(id: string) {
        return await this.expenseRepository.delete(id);
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
