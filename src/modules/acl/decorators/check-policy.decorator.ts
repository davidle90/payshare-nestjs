import { SetMetadata } from "@nestjs/common";
import { Policy } from "../interfaces/policy.interface";

export const CheckPolicy = (...policies: Policy[]) =>
  SetMetadata('policies', policies);
