import { Permissions } from '../permissions/permission.constants';
import { Permission } from '../permissions/permission.types';

export const RolePermissionsMap: Record<string, Permission[]> = {
  admin: [
    Permissions.INBOX_READ,
    Permissions.INBOX_WRITE,
  ],
  user: [
    //
  ],
};
