import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseParticipantService } from '../services/expense-participant.service';
import { CreateExpenseParticipantDto } from '../dto/requests/create-expense-participant-dto';
import { ExpenseParticipantMapper } from '../mappers/expense-participant.mapper';
import { UpdateExpenseParticipantDto } from '../dto/requests/update-expense-participant-dto';
import { ExpenseGroupPolicy } from '../policies/expense-group.policy';

@Controller('expenses/:expenseId/participants')
@UseGuards(AuthGuard('jwt'))
export class ExpenseParticipantsController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly participantService: ExpenseParticipantService,
        private readonly expenseGroupPolicy: ExpenseGroupPolicy,
    ) {}

    @Get()
    async findAll(@Param('expenseId') expenseId) {
        const participants = await this.participantService.findAll(expenseId);
        return { 
            data: ExpenseParticipantMapper.toResponseList(participants),
            meta: {
                count: participants.length
            }
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const participant = await this.participantService.findOne(id);
        if (!participant) throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
        return { data: ExpenseParticipantMapper.toResponse(participant) };
    }

    @Post()
    async create(
        @Req() req,
        @Param('expenseId') expenseId: string,
        @Body() input: CreateExpenseParticipantDto,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        const participant = await this.participantService.create(expenseId, input);

        return { data: ExpenseParticipantMapper.toResponse(participant) };
    }

    @Put(':id')
    async update(
        @Req() req,
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
        @Body() input: UpdateExpenseParticipantDto,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, expense.group)) {
            throw new ForbiddenException();
        }

        const participant = await this.participantService.update(id, expenseId, input);
        if (!participant) throw new HttpException('Updated participant not found', HttpStatus.NOT_FOUND);

        return { data: ExpenseParticipantMapper.toResponse(participant) };
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

        const participant = await this.participantService.findOne(id);
        if (!participant) throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);

        await this.participantService.delete(participant.id);
    }
}
