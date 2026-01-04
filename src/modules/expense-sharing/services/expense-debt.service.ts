import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpenseDebt } from "../entities/expense-debt.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExpenseDebtService {
    constructor(
        @InjectRepository(ExpenseDebt) private readonly debtRepository: Repository<ExpenseDebt>
    ) {}

    async findByGroupId(groupId: string) {
        return await this.debtRepository.find({ where: { groupId }, relations: ['fromUser', 'toUser'] });
    }
}