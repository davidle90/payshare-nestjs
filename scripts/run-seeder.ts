import path from 'path';
import { pathToFileURL } from 'url';
import { AppDataSource } from '../ormconfig.data-source';

//WIP: do this instead: npx ts-node -r tsconfig-paths/register src/seeders/DatabaseSeeder.ts

const seederName = process.argv[2];

if (!seederName) {
  console.error('Usage: npm run db:seed <SeederName>');
  process.exit(1);
}

// Build path to seeder
const seederPath = path.join('src', 'seeders', `${seederName}.ts`);

async function run() {
  const dataSource = await AppDataSource.initialize();
  try {
    const { default: SeederClass } = await import(pathToFileURL(seederPath).href);
    const seeder = new SeederClass();
    await seeder.run(dataSource);
    console.log('Seeding complete!');
  } catch (err) {
    console.error(err);
  } finally {
    await dataSource.destroy();
  }
}

run();
