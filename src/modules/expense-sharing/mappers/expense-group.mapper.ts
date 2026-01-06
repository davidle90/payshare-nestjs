import { ExpenseGroup } from '../entities/expense-group.entity';
import { ExpenseGroupResponseDto } from '../dto/responses/expense-group-response-dto';
import { ExpenseGroupMemberMapper } from './expense-group-member.mapper';
import { ExpenseMapper } from './expense.mapper';
import { ExpenseDebtMapper } from './expense-debt.mapper';

export class ExpenseGroupMapper {
  static toResponse(group: ExpenseGroup, includes: string[] = []): ExpenseGroupResponseDto {
    const response: ExpenseGroupResponseDto = {
      object: 'expense_group',
      id: group.id,
      referenceId: group.referenceId,
      name: group.name,
      currency: group.currency,
      totalExpenses: Number(group.totalExpenses),
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };

    if (includes.includes('members') && group.members) {
      response.members = ExpenseGroupMemberMapper.toResponseList(group.members);
    }

    if (includes.includes('expenses') && group.expenses) {
      response.expenses = ExpenseMapper.toResponseList(group.expenses, [], 10);
    }

    if (includes.includes('debts') && group.debts) {
      response.debts = ExpenseDebtMapper.toResponseList(group.debts);
    }

    return response;
  }

  static toResponseList(groups: ExpenseGroup[], includes: string[] = []) {
    return groups.map(group => this.toResponse(group, includes));
  }
}
