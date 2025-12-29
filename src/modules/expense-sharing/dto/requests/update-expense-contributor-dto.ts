import { IsDecimal } from "class-validator";

export class UpdateExpenseContributorDto {
    @IsDecimal()
    amountOwed: number;
}