import { IsString } from "class-validator";

export class UpdateExpenseGroupMemberDto {
    @IsString()
    role: string;
}
