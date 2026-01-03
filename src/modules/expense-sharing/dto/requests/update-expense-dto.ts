import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateExpenseDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsBoolean()
    isSettled: boolean;

    @IsString()
    @IsOptional()
    editedByUserId?: string;
}
