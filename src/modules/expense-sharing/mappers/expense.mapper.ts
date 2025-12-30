import { ExpenseResponseDto } from "../dto/responses/expense-response-dto";
import { Expense } from "../entities/expense.entity";
import { ExpenseContributorMapper } from "./expense-contributor.mapper";
import { ExpenseGroupMapper } from "./expense-group.mapper";
import { ExpenseParticipantMapper } from "./expense-participant.mapper";

export class ExpenseMapper {
  static toResponse(expense: Expense, includes: string[] = []): ExpenseResponseDto {
    const response: ExpenseResponseDto = {
      object: 'expense',
      id: expense.id,
      referenceId: expense.referenceId,
      groupId: expense.groupId,
      name: expense.name,
      description: expense.description,
      currency: expense.currency,
      totalAmount: Number(expense.totalAmount),
      status: expense.status,
      isSettled: expense.isSettled,
      editedByUserId: expense.editedByUserId,
      createdByUser: expense.createdByUser,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };

    if (includes.includes('group') && expense.group) {
      response.group = ExpenseGroupMapper.toResponse(expense.group);
    }

    if (includes.includes('participants') && expense.participants) {
      response.participants = ExpenseParticipantMapper.toResponseList(expense.participants);
    }

    if (includes.includes('contributors') && expense.contributors) {
      response.contributors = ExpenseContributorMapper.toResponseList(expense.contributors);
    }

    return response;
  }

  static toResponseList(expenses: Expense[], includes: string[] = []) {
    return expenses.map(expense => this.toResponse(expense, includes));
  }
}
