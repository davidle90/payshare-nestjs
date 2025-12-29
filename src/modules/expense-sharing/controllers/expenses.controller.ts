import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/create-expense-dto';
import { UpdateExpenseDto } from '../dto/update-expense-dto';
import { ExpenseMapper } from '../mappers/expense.mapper';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
    constructor(
        private readonly expenseService: ExpenseService,
    ) {}

    @Get()
    async findAll(@User('userId') userId: string, @Query('search') search?: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const expenses = await this.expenseService.findAll()
            
        return {
            data: ExpenseMapper.toResponseList(expenses, includesArray),
            meta: {
                count: expenses.length
            }
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const expense = await this.expenseService.findOne(id)
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        return { data: ExpenseMapper.toResponse(expense, includesArray)}
    }

    @Post()
    async create(@Body(ValidationPipe) input: CreateExpenseDto) {
        const expense = await this.expenseService.create(input);
        return { data: ExpenseMapper.toResponse(expense)}
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body(ValidationPipe) input: UpdateExpenseDto) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)
        
        const updatedExpense = await this.expenseService.update(expense.id, input);
        if(!updatedExpense) throw new HttpException('Updated expense not found', HttpStatus.NOT_FOUND)

        return { data: ExpenseMapper.toResponse(updatedExpense)}
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        await this.expenseService.delete(expense.id)
    }
}
