/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/acl/roles/role.entity';
import * as bcrypt from 'bcrypt';

export default class CreateUsersSeeder {
  public async run(dataSource) {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);

    // find admin role
    const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
    if (!adminRole) throw new Error('Admin role not found!');

    // check if admin user exists
    const adminExists = await userRepo.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!adminExists) {
      const admin = userRepo.create({
        name: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        roles: [adminRole],
      });
      await userRepo.save(admin);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  }
}
