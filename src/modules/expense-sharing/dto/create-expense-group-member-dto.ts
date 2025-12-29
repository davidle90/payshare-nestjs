import { IsEnum, IsOptional, IsString } from "class-validator";

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export class CreateExpenseGroupMemberDto {
    @IsString()
    userId: string;

    @IsEnum(MemberRole)
    @IsOptional()
    role?: MemberRole;
}
