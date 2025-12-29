import { IsDecimal } from "class-validator";

export class UpdateExpenseContributorDto {
    @IsDecimal()
    amountPaid: number;
}