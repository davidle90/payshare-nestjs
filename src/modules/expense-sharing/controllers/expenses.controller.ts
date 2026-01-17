import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/requests/create-expense-dto';
import { UpdateExpenseDto } from '../dto/requests/update-expense-dto';
import { ExpenseMapper } from '../mappers/expense.mapper';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseGroupService } from '../services/expense-group.service';
import { ExpenseGroupPolicy } from '../policies/expense-group.policy';
import { Expense } from '../entities/expense.entity';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly groupService: ExpenseGroupService,
        private readonly expenseGroupPolicy: ExpenseGroupPolicy,
        
    ) {}

    @Get()
    async findAll(@Req() req, @Query('groupId') groupId?: string, @Query('search') search?: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        let expenses: Expense[];

        if (!this.expenseGroupPolicy.canReadAll(req.user)) {
            expenses = await this.expenseService.findAll({groupId, search, includes: includesArray, userId: req.user.id})
        } else {
            expenses = await this.expenseService.findAll({groupId, search, includes: includesArray})
        }
            
        return {
            data: ExpenseMapper.toResponseList(expenses, includesArray),
            meta: {
                count: expenses.length
            }
        };
    }

    @Get(':id')
    async findOne(@Req() req, @Param('id') id: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const expense = await this.expenseService.findOne(id, includesArray)
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (!this.expenseGroupPolicy.canRead(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        return { data: ExpenseMapper.toResponse(expense, includesArray)}
    }

    @Post()
    async create(@Req() req, @Body(ValidationPipe) input: CreateExpenseDto) {
        const group = await this.groupService.findOne(input.groupId)
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        if (!this.expenseGroupPolicy.canRead(req.user, group)) {
            throw new ForbiddenException();
        }

        input.groupId = group.id;

        const expense = await this.expenseService.create(input);
        return { data: ExpenseMapper.toResponse(expense)}
    }

    @Put(':id')
    async update(@Req() req, @User('userId') userId: string, @Param('id') id: string, @Body(ValidationPipe) input: UpdateExpenseDto) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (!this.expenseGroupPolicy.canRead(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        input.editedByUserId = userId;
        
        const updatedExpense = await this.expenseService.update(expense.id, input);
        if(!updatedExpense) throw new HttpException('Updated expense not found', HttpStatus.NOT_FOUND)

        return { data: ExpenseMapper.toResponse(updatedExpense)}
    }

    @Delete(':id')
    async delete(@Req() req, @Param('id') id: string) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (!this.expenseGroupPolicy.canRead(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        await this.expenseService.delete(expense)
    }

    @Post(':id/finalize')
    async finalize(@Req() req, @Param('id') id: string) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (!this.expenseGroupPolicy.canRead(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        const finalizedExpense = await this.expenseService.finalizeExpense(expense.id);

        return { data: ExpenseMapper.toResponse(finalizedExpense) }
    }
}
