import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateExpenseDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    category: string;

    @IsString()
    @IsOptional()
    editedByUserId?: string;
}
