import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseContributorDto } from '../dto/requests/create-expense-contributor-dto';
import { ExpenseContributorService } from '../services/expense-contributor.service';
import { ExpenseContributorMapper } from '../mappers/expense-contributor.mapper';
import { UpdateExpenseContributorDto } from '../dto/requests/update-expense-contributor-dto';

@Controller('expenses/:expenseId/contributors')
@UseGuards(AuthGuard('jwt'))
export class ExpenseContributorsController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly contributorService: ExpenseContributorService,
    ) {}

    @Get()
    async findAll(@Param('expenseId') expenseId) {
        const contributors = await this.contributorService.findAll(expenseId);
        return { data: ExpenseContributorMapper.toResponseList(contributors) };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const contributor = await this.contributorService.findOne(id);
        if (!contributor) throw new HttpException('Contributor not found', HttpStatus.NOT_FOUND);
        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Post()
    async create(
        @Param('expenseId') expenseId: string,
        @Body() input: CreateExpenseContributorDto,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isMember = await this.memberService.isMember(expense.group, userId);
        if (!isMember) {
            throw new HttpException('You are not a member in this group', HttpStatus.UNAUTHORIZED);
        }

        const contributor = await this.contributorService.create(expenseId, input);

        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
        @Body() input: UpdateExpenseContributorDto,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isAdmin = await this.memberService.isAdmin(expense.group, userId);
        if (!isAdmin) throw new HttpException('You are not authorized to update contributors', HttpStatus.UNAUTHORIZED);

        const contributor = await this.contributorService.update(id, expenseId, input);
        if (!contributor) throw new HttpException('Updated contributor not found', HttpStatus.NOT_FOUND);

        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isAdmin = await this.memberService.isAdmin(expense.group, userId);
        if (!isAdmin) throw new HttpException('You are not authorized to delete contributors', HttpStatus.UNAUTHORIZED);

        const contributor = await this.contributorService.findOne(id);
        if (!contributor) throw new HttpException('Contributor not found', HttpStatus.NOT_FOUND);

        await this.contributorService.delete(contributor.id);
    }
}