import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { ExpenseParticipantService } from '../services/expense-participant.service';
import { CreateExpenseParticipantDto } from '../dto/requests/create-expense-participant-dto';
import { ExpenseParticipantMapper } from '../mappers/expense-participant.mapper';
import { UpdateExpenseParticipantDto } from '../dto/requests/update-expense-participant-dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerFindAllParticipants, SwaggerFindOneParticipant, SwaggerCreateParticipant, SwaggerUpdateParticipant, SwaggerDeleteParticipant } from '../decorators/swagger/participants.swagger.decorators';

@ApiTags('expense-participants')
@ApiBearerAuth()
@Controller('expenses/:expenseId/participants')
@UseGuards(AuthGuard('jwt'))
export class ExpenseParticipantsController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly participantService: ExpenseParticipantService,
    ) {}

    @Get()
    @SwaggerFindAllParticipants()
    async findAll(@Param('expenseId') expenseId) {
        const participants = await this.participantService.findAll(expenseId);
        return { data: ExpenseParticipantMapper.toResponseList(participants) };
    }

    @Get(':id')
    @SwaggerFindOneParticipant()
    async findOne(@Param('id') id: string) {
        const participant = await this.participantService.findOne(id);
        if (!participant) throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
        return { data: ExpenseParticipantMapper.toResponse(participant) };
    }

    @Post()
    @SwaggerCreateParticipant()
    async create(
        @Param('expenseId') expenseId: string,
        @Body() input: CreateExpenseParticipantDto,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isMember = await this.memberService.isMember(expense.group, userId);
        if (!isMember) {
            throw new HttpException('You are not a member of this group', HttpStatus.UNAUTHORIZED);
        }

        const participant = await this.participantService.create(expenseId, input);

        return { data: ExpenseParticipantMapper.toResponse(participant) };
    }

    @Put(':id')
    @SwaggerUpdateParticipant()
    async update(
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
        @Body() input: UpdateExpenseParticipantDto,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isAdmin = await this.memberService.isAdmin(expense.group, userId);
        if (!isAdmin) throw new HttpException('You are not authorized to update participants', HttpStatus.UNAUTHORIZED);

        const participant = await this.participantService.update(id, expenseId, input);
        if (!participant) throw new HttpException('Updated participant not found', HttpStatus.NOT_FOUND);

        return { data: ExpenseParticipantMapper.toResponse(participant) };
    }

    @Delete(':id')
    @SwaggerDeleteParticipant()
    async delete(
        @Param('id') id: string,
        @Param('expenseId') expenseId: string,
        @User('userId') userId: string,
    ) {
        const expense = await this.expenseService.findOne(expenseId);
        if (!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
        if (!expense.group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isAdmin = await this.memberService.isAdmin(expense.group, userId);
        if (!isAdmin) throw new HttpException('You are not authorized to delete participants', HttpStatus.UNAUTHORIZED);

        const participant = await this.participantService.findOne(id);
        if (!participant) throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);

        await this.participantService.delete(participant.id);
    }
}
