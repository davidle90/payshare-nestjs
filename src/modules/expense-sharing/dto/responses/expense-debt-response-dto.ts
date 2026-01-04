import { UserResponseDto } from "src/modules/users/dto/user-response-dto";

export class ExpenseDebtResponseDto {
  object: 'expense_debt';
  id: string;
  groupId: string;
  fromUser: UserResponseDto;
  toUser: UserResponseDto
  amount: number;
}
