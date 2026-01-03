import { Role } from '../../acl/roles/role.entity';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}
