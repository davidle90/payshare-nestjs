import { IsDecimal, IsString } from "class-validator";

export class CreateExpenseContributorDto {
    @IsString()
    memberId: string;

    @IsDecimal()
    amountPaid: number;
}
