import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from '../dto/create-expense-dto';
import { UpdateExpenseDto } from '../dto/update-expense-dto';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>
    ) {}

    async findAll() {
        return await this.expenseRepository.find();
    }

    async findOne(id: string) {
        return await this.expenseRepository.findOneBy({ id });
    }

    async create(input: CreateExpenseDto) {
        const expense = this.expenseRepository.create(input);
        return await this.expenseRepository.save(expense);
    }

    async update(id: string, input: UpdateExpenseDto) {
        return await this.expenseRepository.update(id, input);
    }

    async delete(id: string) {
        return await this.expenseRepository.delete(id);
    }
}
