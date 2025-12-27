/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Role } from '../modules/acl/roles/role.entity';

export default class CreateRolesSeeder {
  public async run(dataSource) {
    const roleRepo = dataSource.getRepository(Role);

    const roles = ['admin', 'user', 'manager'];
    for (const name of roles) {
      const exists = await roleRepo.findOne({ where: { name } });
      if (!exists) {
        await roleRepo.save(roleRepo.create({ name }));
        console.log(`Role created: ${name}`);
      }
    }
  }
}
