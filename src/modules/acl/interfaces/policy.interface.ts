export interface Policy<T = any> {
  canCreate?(user: any, resource?: T): boolean | Promise<boolean>;
  canRead?(user: any, resource: T): boolean | Promise<boolean>;
  canUpdate?(user: any, resource: T): boolean | Promise<boolean>;
  canDelete?(user: any, resource: T): boolean | Promise<boolean>;
}
