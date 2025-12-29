import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from '../dto/requests/create-expense-dto';
import { UpdateExpenseDto } from '../dto/requests/update-expense-dto';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>
    ) {}

    async findAll() {
        return await this.expenseRepository.find();
    }

    async findOne(referenceId: string) {
        return await this.expenseRepository.findOneBy({ referenceId });
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
