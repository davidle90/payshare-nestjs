import { RoleName } from "../constants/role.constants";
import { Role } from "../roles/role.entity";

export function hasRole(
  user: { roles?: Role[] },
  role: RoleName,
): boolean {
  return user.roles?.some(r => r.name === role) ?? false;
}

export function hasAnyRole(
    user: { roles: Role[] },
    roles: Role[],
): boolean {
    return roles.some(r => user.roles?.includes(r));
}