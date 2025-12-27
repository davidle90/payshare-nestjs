import { Permissions } from './permission.constants';

export type Permission =
  typeof Permissions[keyof typeof Permissions];
