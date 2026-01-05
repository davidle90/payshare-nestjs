import { IsOptional, IsString } from "class-validator";

export class CreateExpenseDto {
    @IsString()
    groupId: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    category: string;
}
