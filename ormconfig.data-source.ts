import { DataSource } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '.env') });

// Get the module name from command-line args (optional)
const moduleName = process.argv.includes("-m") ? process.argv[process.argv.indexOf("-m") + 1] : undefined;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  // If no module name is provided, include all modules
  entities: moduleName 
    ? [path.join(__dirname, `src/modules/${moduleName}/entities/*.entity.{ts,js}`)] 
    : [path.join(__dirname, 'src/modules/**/*.entity.{ts,js}')], // Globally include all modules' entities

  migrations: [
    path.join(__dirname, 'src/migrations/*.{ts,js}'),          // Global migrations
    moduleName 
      ? path.join(__dirname, `src/modules/${moduleName}/migrations/*.{ts,js}`) // Module-specific migrations
      : path.join(__dirname, 'src/modules/**/migrations/*.{ts,js}'),   // All modules' migrations
  ],

  migrationsTableName: 'migrations',
  synchronize: false, // Don't automatically sync, set to false for production
});
