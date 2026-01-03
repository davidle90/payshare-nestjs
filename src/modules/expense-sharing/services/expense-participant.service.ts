import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseParticipant } from '../entities/expense-participant.entity';
import { Repository } from 'typeorm';
import { UpdateExpenseParticipantDto } from '../dto/requests/update-expense-participant-dto';
import { CreateExpenseParticipantDto } from '../dto/requests/create-expense-participant-dto';
import { ExpenseGroupMemberService } from './expense-group-member.service';
import { ExpenseService } from './expense.service';
import { ExpenseStatus } from '../entities/expense.entity';

@Injectable()
export class ExpenseParticipantService {
    constructor(
        @InjectRepository(ExpenseParticipant) private readonly participantRepository: Repository<ExpenseParticipant>,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly expenseService: ExpenseService,
    ) {}

    async findAll(expenseId: string){
        const participants = await this.participantRepository.find({
            where: { expense: { referenceId: expenseId }}
        });

        return participants;
    }

    async findOne(id: string){
        return await this.participantRepository.findOneBy({ id });
    }

    async create(expenseId: string, input: CreateExpenseParticipantDto) {
        const expense = await this.expenseService.findOne(expenseId);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (expense.status === ExpenseStatus.FINALIZED) {
            throw new BadRequestException('Cannot modify a finalized expense');
        }
        
        const member = await this.memberService.findOne(input.memberId);
        if(!member) throw new HttpException('Member not found', HttpStatus.NOT_FOUND)

        const userId = member.user.id;

        const participant = this.participantRepository.create({
            ...input,
            expenseId: expense.id,
            userId
        });

        await this.participantRepository.save(participant);

        return participant;
    }

    async update(participantId: string, expenseId: string, input: UpdateExpenseParticipantDto) {
        const expense = await this.expenseService.findOne(expenseId);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (expense.status === ExpenseStatus.FINALIZED) {
            throw new BadRequestException('Cannot modify a finalized expense');
        }

        await this.participantRepository.update(
            participantId,
            {
                ...input,
                expenseId: expense.id
            }
        );

        const updatedParticipant = await this.participantRepository.findOneBy({ id: participantId });
        if(!updatedParticipant) throw new HttpException('Updated participant not found', HttpStatus.NOT_FOUND)
        
        return updatedParticipant;
    }

    async delete(id: string) {
        const participant = await this.participantRepository.findOneBy({ id })
        if(!participant) throw new HttpException('Participant not found', HttpStatus.NOT_FOUND)

        const expense = await this.expenseService.findById(participant.expenseId);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (expense.status === ExpenseStatus.FINALIZED) {
            throw new BadRequestException('Cannot modify a finalized expense');
        }

        await this.participantRepository.delete(id);
        return { success: true };
    }
}
