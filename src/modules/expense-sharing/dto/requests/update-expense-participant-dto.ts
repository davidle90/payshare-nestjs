import { IsDecimal } from "class-validator";

export class UpdateExpenseParticipantDto {
    @IsDecimal()
    amountOwed: number;
}