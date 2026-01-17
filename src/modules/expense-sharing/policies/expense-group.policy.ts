import { Injectable } from "@nestjs/common";
import { Policy } from "src/modules/acl/interfaces/policy.interface";
import { User } from "src/modules/users/entities/user.entity";
import { ExpenseGroup } from "../entities/expense-group.entity";
import { hasRole } from "src/modules/acl/utils/roles.util";
import { ExpenseGroupMemberService } from "../services/expense-group-member.service";
import { Roles } from "src/modules/acl/constants/role.constants";

@Injectable()
export class ExpenseGroupPolicy implements Policy<ExpenseGroup> {
    constructor(
        private readonly memberService: ExpenseGroupMemberService,
    ) {}

    canReadAll(user: User) {
        return hasRole(user, Roles.ADMIN);
    }

    isOwner(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isOwner(group, user.id);
    }

    isAdmin(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isAdmin(group, user.id);
    }

    isMember(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isMember(group, user.id);
    }

    canCreate(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isMember(group, user.id);
    }

    canRead(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isMember(group, user.id);
    }

    canUpdate(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isMember(group, user.id);
    }

    canDelete(user: User, group: ExpenseGroup) {
        if (hasRole(user, Roles.ADMIN)) return true;
        return this.memberService.isAdmin(group, user.id);
    }
}
