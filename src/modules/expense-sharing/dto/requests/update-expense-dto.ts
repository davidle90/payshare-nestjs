import { IsBoolean, IsDecimal, IsString } from "class-validator";

export class UpdateExpenseDto {
    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsString()
    currency: string;

    @IsDecimal()
    totalAmount: number;

    @IsBoolean()
    isSettled: boolean;

    @IsString()
    editedByUserId: string;
}
