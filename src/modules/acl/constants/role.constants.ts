export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export type RoleName = typeof Roles[keyof typeof Roles];
