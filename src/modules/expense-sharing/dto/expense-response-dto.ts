import { User } from "src/modules/users/entities/user.entity";
import { ExpenseGroup } from "../entities/expense-group.entity";

export class ExpenseResponseDto {
  id: string;
  groupId: string;
  name: string;

  description: string;
  currency: string;
  totalAmount: number;

  isSettled: boolean;
  editedByUserId: string | null | undefined;

  createdAt: Date;
  updatedAt: Date;

  createdByUser?: User;
  group?: ExpenseGroup;
  contributors?: any[];
  participants?: any[];
}
