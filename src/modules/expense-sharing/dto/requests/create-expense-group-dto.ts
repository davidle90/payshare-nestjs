import { IsOptional, IsString } from "class-validator";

export class CreateExpenseGroupDto {
    @IsString()
    name: string;

    @IsString()
    status: string;

    @IsString()
    @IsOptional()
    currency: string;
}
