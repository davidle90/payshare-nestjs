import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseParticipant } from '../entities/expense-participant.entity';
import { Repository } from 'typeorm';
import { ExpenseParticipantDto } from '../dto/expense-participant-dto';

@Injectable()
export class ExpenseParticipantService {
    constructor(
        @InjectRepository(ExpenseParticipant) private readonly participantRepository: Repository<ExpenseParticipant>,
    ) {}

    async addParticipant(expenseId: string, input: ExpenseParticipantDto) {
        const participant = this.participantRepository.create({
            ...input,
            expenseId
        });
        return await this.participantRepository.save(participant);
    }

    async removeParticipant(id: string) {
        return await this.participantRepository.delete(id);
    }
}
