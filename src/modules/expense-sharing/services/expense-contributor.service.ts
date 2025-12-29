import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseContributor } from '../entities/expense-contributor.entity';
import { UpdateExpenseContributorDto } from '../dto/requests/update-expense-contributor-dto';
import { CreateExpenseContributorDto } from '../dto/requests/create-expense-contributor-dto';
import { ExpenseGroupMemberService } from './expense-group-member.service';

@Injectable()
export class ExpenseContributorService {
    constructor(
        @InjectRepository(ExpenseContributor) private readonly contributorRepository: Repository<ExpenseContributor>,
        private readonly memberService: ExpenseGroupMemberService,
    ) {}

    async findAll(){}

    async findOne(){}

    async create(expenseId: string, input: CreateExpenseContributorDto) {
        const member = await this.memberService.findOne(input.memberId);
        if(!member) throw new HttpException('Member not found', HttpStatus.NOT_FOUND)

        const userId = member.user.id;

        const contributor = this.contributorRepository.create({
            ...input,
            expenseId,
            userId
        });

        await this.contributorRepository.save(contributor);

        return contributor;
    }

    async update(contributorId: string, expenseId: string, input: UpdateExpenseContributorDto) {
        this.contributorRepository.update(
            contributorId,
            {
                ...input,
                expenseId
            }
        );

        const updatedParticipant = this.contributorRepository.findOneBy({ id: contributorId });
        if(!updatedParticipant) throw new HttpException('Updated participant not found', HttpStatus.NOT_FOUND)

        return updatedParticipant;
    }

    async delete(id: string) {
        return await this.contributorRepository.delete(id);
    }
}
