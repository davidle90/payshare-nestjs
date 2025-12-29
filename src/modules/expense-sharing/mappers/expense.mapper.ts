import { ExpenseResponseDto } from "../dto/responses/expense-response-dto";
import { Expense } from "../entities/expense.entity";

export class ExpenseMapper {
  static toResponse(expense: Expense, includes: string[] = []): ExpenseResponseDto {
    const response: ExpenseResponseDto = {
      id: expense.id,
      referenceId: expense.referenceId,
      groupId: expense.groupId,
      name: expense.name,
      description: expense.description,
      currency: expense.currency,
      totalAmount: Number(expense.totalAmount),
      isSettled: expense.isSettled,
      editedByUserId: expense.editedByUserId,
      createdByUser: expense.createdByUser,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };

    if (includes.includes('group') && expense.group) {
      response.group = expense.group;
    }

    if (includes.includes('participants') && expense.participants) {
      response.participants = expense.participants;
    }

    if (includes.includes('contributors') && expense.contributors) {
      response.contributors = expense.contributors;
    }

    return response;
  }

  static toResponseList(expenses: Expense[], includes: string[] = []) {
    return expenses.map(expense => this.toResponse(expense, includes));
  }
}
