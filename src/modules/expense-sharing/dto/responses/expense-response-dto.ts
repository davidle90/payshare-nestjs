import { ExpenseGroupResponseDto } from "./expense-group-response-dto";
import { UserResponseDto } from "src/modules/users/dto/user-response-dto";
import { ExpenseParticipantResponseDto } from "./expense-participant-response-dto";
import { ExpenseContributorResponseDto } from "./expense-contributor-response-dto";

export class ExpenseResponseDto {
  object: 'expense';
  id: string;
  referenceId: string;
  groupId: string;

  name: string;
  description: string;
  totalAmount: number;

  category: string;
  status: string;
  
  isSettled: boolean;
  editedByUserId: string | null | undefined;

  createdAt: Date;
  updatedAt: Date;

  createdByUser?: UserResponseDto;
  group?: ExpenseGroupResponseDto;
  contributors?: ExpenseContributorResponseDto[];
  participants?: ExpenseParticipantResponseDto[];
}
