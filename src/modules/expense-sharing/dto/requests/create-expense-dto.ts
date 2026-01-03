import { IsString } from "class-validator";

export class CreateExpenseDto {
    @IsString()
    groupId: string;

    @IsString()
    name: string;

    @IsString()
    description: string;
}
