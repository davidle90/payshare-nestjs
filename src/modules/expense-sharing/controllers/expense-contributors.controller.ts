import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { ExpenseGroupService } from '../services/expense-group.service';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseContributorDto } from '../dto/requests/create-expense-contributor-dto';
import { ExpenseContributorService } from '../services/expense-contributor.service';
import { ExpenseContributorMapper } from '../mappers/expense-contributor.mapper';

@Controller('expenses/:expenseId/contributors')
@UseGuards(AuthGuard('jwt'))
export class ExpenseContributorsController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly groupService: ExpenseGroupService,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly contributorService: ExpenseContributorService,
    ) {}

    @Get()
    async findAll() {
        return 'contributors'
    }

    @Get(':id')
    async findOne() {
        return 'contributor'
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

        const isAdmin = await this.memberService.isAdmin(expense.group, userId);
        if (!isAdmin) {
            throw new HttpException('You are not authorized to add participants', HttpStatus.UNAUTHORIZED);
        }

        const contributor = await this.contributorService.create(expense.id, input);

        return { data: ExpenseContributorMapper.toResponse(contributor) };
    }

    @Put(':id')
    async update() {
        return 'update contributor'
    }

    @Delete(':id')
    async delete() {
        return 'delete contributor'
    }
}