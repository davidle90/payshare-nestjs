import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/requests/create-expense-dto';
import { UpdateExpenseDto } from '../dto/requests/update-expense-dto';
import { ExpenseMapper } from '../mappers/expense.mapper';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseGroupService } from '../services/expense-group.service';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly groupService: ExpenseGroupService,
        private readonly memberService: ExpenseGroupMemberService,
    ) {}

    @Get()
    async findAll(@User('userId') userId: string, @Query('groupId') groupId?: string, @Query('search') search?: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const expenses = await this.expenseService.findAll({groupId, search, includes: includesArray})

        //todo: should fetch only from own groups?
            
        return {
            data: ExpenseMapper.toResponseList(expenses, includesArray),
            meta: {
                count: expenses.length
            }
        };
    }

    @Get(':id')
    async findOne(@User('userId') userId: string, @Param('id') id: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const expense = await this.expenseService.findOne(id, includesArray)
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(expense.group, userId)
        if(!isMember) throw new HttpException('You do not have permission to view this expense', HttpStatus.UNAUTHORIZED)

        //todo: add permission to bypass isMember check.

        return { data: ExpenseMapper.toResponse(expense, includesArray)}
    }

    @Post()
    async create(@User('userId') userId: string, @Body(ValidationPipe) input: CreateExpenseDto) {
        const group = await this.groupService.findOne(input.groupId)
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(group, userId)
        if(!isMember) throw new HttpException('You do not have permission to create expense for this group', HttpStatus.UNAUTHORIZED)

        //todo: add permission to bypass isMember check.

        input.groupId = group.id;

        const expense = await this.expenseService.create(input);
        return { data: ExpenseMapper.toResponse(expense)}
    }

    @Put(':id')
    async update(@User('userId') userId: string, @Param('id') id: string, @Body(ValidationPipe) input: UpdateExpenseDto) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(expense.group, userId)
        if(!isMember) throw new HttpException('You do not have permission to update this expense', HttpStatus.UNAUTHORIZED)

        input.editedByUserId = userId;
        //todo: add permission to bypass isMember check.
        
        const updatedExpense = await this.expenseService.update(expense.id, input);
        if(!updatedExpense) throw new HttpException('Updated expense not found', HttpStatus.NOT_FOUND)

        return { data: ExpenseMapper.toResponse(updatedExpense)}
    }

    @Delete(':id')
    async delete(@User('userId') userId: string, @Param('id') id: string) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(expense.group, userId)
        if(!isMember) throw new HttpException('You do not have permission to delete this expense', HttpStatus.UNAUTHORIZED)

        //todo: add permission to bypass isMember check.

        await this.expenseService.delete(expense)
    }

    @Post(':id/finalize')
    async finalize(@Param('id') id: string, @User('userId') userId: string) {
        const expense = await this.expenseService.findOne(id);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(expense.group, userId)
        if(!isMember) throw new HttpException('You do not have permission to delete this expense', HttpStatus.UNAUTHORIZED)

        return this.expenseService.finalizeExpense(expense.id);
    }
}
