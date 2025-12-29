import { ExpenseContributorResponseDto } from "../dto/responses/expense-contributor-response-dto";
import { ExpenseContributor } from "../entities/expense-contributor.entity";

export class ExpenseContributorMapper {
  static toResponse(contributor: ExpenseContributor): ExpenseContributorResponseDto {
    const response: ExpenseContributorResponseDto = {
      id: contributor.id,
      expenseId: contributor.expenseId,
      userId: contributor.userId,
      memberId: contributor.memberId,
      amountPaid: contributor.amountPaid,
      createdAt: contributor.createdAt,
      updatedAt: contributor.updatedAt,
    };

    return response;
  }

  static toResponseList(contributors: ExpenseContributor[]) {
    return contributors.map(contributor => this.toResponse(contributor));
  }
}
