import { UserMapper } from 'src/modules/users/mappers/user.mapper';
import { ExpenseDebtResponseDto } from '../dto/responses/expense-debt-response-dto';
import { ExpenseDebt } from '../entities/expense-debt.entity';

export class ExpenseDebtMapper {
  static toResponse(debt: ExpenseDebt, includes: string[] = []): ExpenseDebtResponseDto {
    const response: ExpenseDebtResponseDto = {
      object: 'expense_debt',
      id: debt.id,
      groupId: debt.groupId,
      fromUser: UserMapper.toResponse(debt.fromUser),
      toUser: UserMapper.toResponse(debt.toUser),
      amount: Number(debt.amount),
    };

    return response;
  }

  static toResponseList(debts: ExpenseDebt[], includes: string[] = []) {
    return debts.map(debt => this.toResponse(debt, includes));
  }
}
