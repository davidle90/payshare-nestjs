import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/requests/create-expense-dto';
import { UpdateExpenseDto } from '../dto/requests/update-expense-dto';
import { ExpenseMapper } from '../mappers/expense.mapper';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseGroupService } from '../services/expense-group.service';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly groupService: ExpenseGroupService,
    ) {}

    @Get()
    async findAll(@User('userId') userId: string, @Query('search') search?: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const expenses = await this.expenseService.findAll()

        //add filter to show expenses from own groups
            
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

        //todo: add member check?

        return { data: ExpenseMapper.toResponse(expense, includesArray)}
    }

    @Post()
    async create(@Body(ValidationPipe) input: CreateExpenseDto) {
        const group = await this.groupService.findOne(input.groupId)
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        //todo: can only create for own group?

        input.groupId = group.id;

        const expense = await this.expenseService.create(input);
        return { data: ExpenseMapper.toResponse(expense)}
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body(ValidationPipe) input: UpdateExpenseDto) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        //todo: add is member check, update editbyuserid. memberId?
        
        const updatedExpense = await this.expenseService.update(expense.id, input);
        if(!updatedExpense) throw new HttpException('Updated expense not found', HttpStatus.NOT_FOUND)

        return { data: ExpenseMapper.toResponse(updatedExpense)}
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        //todo: delete participants and contributors and debts?

        await this.expenseService.delete(expense.id)
    }
}
