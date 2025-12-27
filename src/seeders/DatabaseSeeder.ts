import { AppDataSource } from '../../ormconfig.data-source';
import CreateAdminSeeder from './CreateAdminSeeder';
import CreateRolesSeeder from './CreateRolesSeeder';

export default class DatabaseSeeder {
  public async run() {
    const dataSource = await AppDataSource.initialize();

    try {
      await new CreateRolesSeeder().run(dataSource);
      await new CreateAdminSeeder().run(dataSource);
      // await new CreateTenantsSeeder().run(dataSource);
      console.log('Database seeding complete!');
    } catch (err) {
      console.error(err);
    } finally {
      await dataSource.destroy();
    }
  }
}

// Run manually
if (require.main === module) {
  new DatabaseSeeder().run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
