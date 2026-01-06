import { UserMapper } from "src/modules/users/mappers/user.mapper";
import { ExpenseContributorResponseDto } from "../dto/responses/expense-contributor-response-dto";
import { ExpenseContributor } from "../entities/expense-contributor.entity";

export class ExpenseContributorMapper {
  static toResponse(contributor: ExpenseContributor): ExpenseContributorResponseDto {
    const response: ExpenseContributorResponseDto = {
      object: 'expense_contributor',
      id: contributor.id,
      expenseId: contributor.expenseId,
      userId: contributor.userId,
      memberId: contributor.memberId,
      amountPaid: contributor.amountPaid,
      user: contributor.user ? UserMapper.toResponse(contributor.user) : null,
      createdAt: contributor.createdAt,
      updatedAt: contributor.updatedAt,
    };

    return response;
  }

  static toResponseList(contributors: ExpenseContributor[]) {
    return contributors.map(contributor => this.toResponse(contributor));
  }
}
