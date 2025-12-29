import { ExpenseParticipantResponseDto } from "../dto/responses/expense-participant-response-dto";
import { ExpenseParticipant } from "../entities/expense-participant.entity";

export class ExpenseParticipantMapper {
  static toResponse(participant: ExpenseParticipant): ExpenseParticipantResponseDto {
    const response: ExpenseParticipantResponseDto = {
      id: participant.id,
      expenseId: participant.expenseId,
      userId: participant.userId,
      memberId: participant.memberId,
      amountOwed: participant.amountOwed,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
    };

    return response;
  }

  static toResponseList(participants: ExpenseParticipant[]) {
    return participants.map(participant => this.toResponse(participant));
  }
}
