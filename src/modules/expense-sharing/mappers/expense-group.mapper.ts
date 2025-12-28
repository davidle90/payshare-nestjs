import { ExpenseGroup } from '../entities/expense-group.entity';
import { ExpenseGroupResponseDto } from '../dto/expense-group-response-dto';

export class ExpenseGroupMapper {
  static toResponse(group: ExpenseGroup): ExpenseGroupResponseDto {
    return {
      id: group.id,
      referenceId: group.referenceId,
      name: group.name,
      totalExpenses: Number(group.totalExpenses),
      status: group.status,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,

      members: group.members,
      expenses: group.expenses,
      debts: group.debts,
    };
  }

  static toResponseList(groups: ExpenseGroup[]) {
    return groups.map(this.toResponse);
  }
}
