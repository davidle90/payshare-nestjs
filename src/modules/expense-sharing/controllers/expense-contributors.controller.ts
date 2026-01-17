import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseContributorDto } from '../dto/requests/create-expense-contributor-dto';
import { ExpenseContributorService } from '../services/expense-contributor.service';
import { ExpenseContributorMapper } from '../mappers/expense-contributor.mapper';
import { UpdateExpenseContributorDto } from '../dto/requests/update-expense-contributor-dto';
import { ExpenseGroupPolicy } from '../policies/expense-group.policy';

@Controller('expenses/:expenseId/contributors')
@UseGuards(AuthGuard('jwt'))
export class ExpenseContributorsController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly contributorService: ExpenseContributorService,
        private readonly expenseGroupPolicy: ExpenseGroupPolicy,
    ) {}

    @Get()
    async findAll(@Param('expenseId') expenseId) {
        const contributors = await this.contributorService.findAll(expenseId);
        return {
            data: ExpenseContributorMapper.toResponseList(contributors),
            meta: {
                count: contributors.length
            }
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const contributor = await this.contributorService.findOne(id);
        if (!contributor) throw new HttpException('Contributor not found', HttpStatus.NOT_FOUND);
        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Post()
    async create(
        @Req() req,
        @Param('expenseId') expenseId: string,
        @Body() input: CreateExpenseContributorDto,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        const contributor = await this.contributorService.create(expenseId, input);

        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Put(':id')
    async update(
        @Req() req,
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
        @Body() input: UpdateExpenseContributorDto,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        const contributor = await this.contributorService.update(id, expenseId, input);
        if (!contributor) throw new HttpException('Updated contributor not found', HttpStatus.NOT_FOUND);

        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Delete(':id')
    async delete(
        @Req() req,
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        const contributor = await this.contributorService.findOne(id);
        if (!contributor) throw new HttpException('Contributor not found', HttpStatus.NOT_FOUND);

        await this.contributorService.delete(contributor.id);
    }
}