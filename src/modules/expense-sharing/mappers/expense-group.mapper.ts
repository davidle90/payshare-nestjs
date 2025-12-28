import { ExpenseGroup } from '../entities/expense-group.entity';
import { ExpenseGroupResponseDto } from '../dto/expense-group-response-dto';
import { ExpenseGroupMemberMapper } from './expense-group-member.mapper';

export class ExpenseGroupMapper {
  static toResponse(group: ExpenseGroup, includes: string[] = []): ExpenseGroupResponseDto {
    const response: ExpenseGroupResponseDto = {
      id: group.id,
      referenceId: group.referenceId,
      name: group.name,
      totalExpenses: Number(group.totalExpenses),
      status: group.status,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };

    if (includes.includes('members') && group.members) {
      response.members = ExpenseGroupMemberMapper.toResponseList(group.members);
    }

    if (includes.includes('expenses') && group.expenses) {
      response.expenses = group.expenses;
    }

    if (includes.includes('debts') && group.debts) {
      response.debts = group.debts;
    }

    return response;
  }

  static toResponseList(groups: ExpenseGroup[], includes: string[] = []) {
    return groups.map(group => this.toResponse(group, includes));
  }
}
