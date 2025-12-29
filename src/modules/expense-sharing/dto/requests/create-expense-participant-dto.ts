import { IsDecimal, IsString } from "class-validator";

export class CreateExpenseParticipantDto {
    @IsString()
    memberId: string;

    @IsDecimal()
    amountOwed: number;
}
