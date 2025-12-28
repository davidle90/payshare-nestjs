import { ExpenseGroupMemberResponseDto } from "./expense-group-member-response-dto";

export class ExpenseGroupResponseDto {
  id: string;
  referenceId: string;
  name: string;

  totalExpenses: number;

  status: string;

  createdAt: Date;
  updatedAt: Date;

  members?: ExpenseGroupMemberResponseDto[];

  expenses?: any[];
  debts?: any[];
}
