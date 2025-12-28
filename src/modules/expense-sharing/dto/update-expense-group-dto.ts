import { IsString } from "class-validator";

export class UpdateExpenseGroupDto {
    @IsString()
    name: string;

    @IsString()
    status: string;
}
