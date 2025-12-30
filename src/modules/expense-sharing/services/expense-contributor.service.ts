import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseContributor } from '../entities/expense-contributor.entity';
import { UpdateExpenseContributorDto } from '../dto/requests/update-expense-contributor-dto';
import { CreateExpenseContributorDto } from '../dto/requests/create-expense-contributor-dto';
import { ExpenseGroupMemberService } from './expense-group-member.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EXPENSE_CHANGED_EVENT } from '../events/expense.events';
import { ExpenseService } from './expense.service';
import { ExpenseStatus } from '../entities/expense.entity';

@Injectable()
export class ExpenseContributorService {
    constructor(
        @InjectRepository(ExpenseContributor) private readonly contributorRepository: Repository<ExpenseContributor>,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly expenseService: ExpenseService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(expenseId: string){
        const contributors = await this.contributorRepository.find({
            where: { expense: { referenceId: expenseId }}
        });

        return contributors;
    }

    async findOne(id: string){
        return await this.contributorRepository.findOneBy({ id });
    }

    async create(expenseId: string, input: CreateExpenseContributorDto) {
        const expense = await this.expenseService.findOne(expenseId);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (expense.status === ExpenseStatus.FINALIZED) {
            throw new BadRequestException('Cannot modify a finalized expense');
        }

        const member = await this.memberService.findOne(input.memberId);
        if(!member) throw new HttpException('Member not found', HttpStatus.NOT_FOUND)

        const userId = member.user.id;

        const contributor = this.contributorRepository.create({
            ...input,
            expenseId,
            userId
        });

        await this.contributorRepository.save(contributor);

        this.eventEmitter.emit(EXPENSE_CHANGED_EVENT, {
            expenseId,
        });

        return contributor;
    }

    async update(contributorId: string, expenseId: string, input: UpdateExpenseContributorDto) {
        const expense = await this.expenseService.findOne(expenseId);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (expense.status === ExpenseStatus.FINALIZED) {
            throw new BadRequestException('Cannot modify a finalized expense');
        }

        await this.contributorRepository.update(
            contributorId,
            {
                ...input,
                expenseId
            }
        );

        this.eventEmitter.emit(EXPENSE_CHANGED_EVENT, {
            expenseId,
        });

        const updatedContributor = await this.contributorRepository.findOneBy({ id: contributorId });
        if(!updatedContributor) throw new HttpException('Updated contributor not found', HttpStatus.NOT_FOUND)

        return updatedContributor;
    }

    async delete(id: string) {
        const contributor = await this.contributorRepository.findOneBy({ id })
        if(!contributor) throw new HttpException('Contributor not found', HttpStatus.NOT_FOUND)

        const expense = await this.expenseService.findOne(contributor.expenseId);
        if(!expense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND)

        if (expense.status === ExpenseStatus.FINALIZED) {
            throw new BadRequestException('Cannot modify a finalized expense');
        }

        await this.contributorRepository.delete(id);

        this.eventEmitter.emit(EXPENSE_CHANGED_EVENT, {
            expenseId: contributor.expenseId,
        });

        return { success: true };
    }
}
