import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseContributor } from '../entities/expense-contributor.entity';
import { ExpenseContributorDto } from '../dto/expense-contributor-dto';

@Injectable()
export class ExpenseContributorService {
    constructor(
        @InjectRepository(ExpenseContributor) private readonly contributorRepository: Repository<ExpenseContributor>,
    ) {}

    async addContributor(expenseId: string, input: ExpenseContributorDto) {
        const contributor = this.contributorRepository.create({
            ...input,
            expenseId
        });
        return await this.contributorRepository.save(contributor);
    }

    async removeContributor(id: string) {
        return await this.contributorRepository.delete(id);
    }
}
