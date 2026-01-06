import { IsOptional, IsString } from "class-validator";

export class UpdateExpenseGroupDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    currency: string;
}
