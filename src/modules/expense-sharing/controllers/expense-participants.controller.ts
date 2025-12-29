import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { ExpenseGroupService } from '../services/expense-group.service';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { ExpenseParticipantService } from '../services/expense-participant.service';
import { CreateExpenseParticipantDto } from '../dto/requests/create-expense-participant-dto';
import { ExpenseParticipantMapper } from '../mappers/expense-participant.mapper';

@Controller('expenses/:expenseId/participants')
@UseGuards(AuthGuard('jwt'))
export class ExpenseParticipantsController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly groupService: ExpenseGroupService,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly participantService: ExpenseParticipantService,
    ) {}

    @Get()
    async findAll() {
        return 'participants'
    }

    @Get(':id')
    async findOne() {
        return 'participant'
    }

    @Post()
    async create(
        @Param('expenseId') expenseId: string,
        @Body() input: CreateExpenseParticipantDto,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);

        const group = await this.groupService.findOne(expense.groupId);
        const isAdmin = await this.memberService.isAdmin(group, userId);
        if (!isAdmin) {
            throw new HttpException('You are not authorized to add participants', HttpStatus.UNAUTHORIZED);
        }

        const participant = await this.participantService.create(expense.id, input);

        return { data: ExpenseParticipantMapper.toResponse(participant) };
    }

    @Put(':id')
    async update() {
        return 'update participant'
    }

    @Delete(':id')
    async delete() {
        return 'delete participant'
    }
}
