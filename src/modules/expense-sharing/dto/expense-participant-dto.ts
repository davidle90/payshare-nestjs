import { IsDecimal, IsString } from "class-validator";

export class ExpenseParticipantDto {
    @IsString()
    expenseId: string;

    @IsString()
    memberId: string;

    @IsDecimal()
    amountOwed: number;
}