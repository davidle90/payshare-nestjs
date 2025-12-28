import { IsDecimal, IsString } from "class-validator";

export class ExpenseContributorDto {
    @IsString()
    expenseId: string;

    @IsString()
    memberId: string;

    @IsDecimal()
    amountPaid: number;
}