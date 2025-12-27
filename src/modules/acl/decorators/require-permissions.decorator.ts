import { SetMetadata } from "@nestjs/common";
import { Permission } from "../permissions/permission.types";

export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
