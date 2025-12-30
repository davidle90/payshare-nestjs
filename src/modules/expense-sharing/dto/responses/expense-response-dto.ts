import { ExpenseGroupResponseDto } from "./expense-group-response-dto";
import { UserResponseDto } from "src/modules/users/dto/user-response-dto";
import { ExpenseParticipantResponseDto } from "./expense-participant-response-dto";
import { ExpenseContributorResponseDto } from "./expense-contributor-response-dto";

export class ExpenseResponseDto {
  id: string;
  referenceId: string;
  groupId: string;

  name: string;
  description: string;
  currency: string;
  totalAmount: number;

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
