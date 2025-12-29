import { IsBoolean, IsDecimal, IsOptional, IsString } from "class-validator";

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
    @IsOptional()
    editedByUserId?: string;
}
