const { execSync } = require("child_process");
const path = require("path");

// Read arguments: migration name
const name = process.argv[2];

if (!name) {
  console.error("Usage: npm run migration:generate <MigrationName>");
  console.error("Example: npm run migration:generate CreateUsersTable");
  process.exit(1);
}

// Resolve paths
const dataSourcePath = path.join("ormconfig.data-source.ts");
const migrationsPath = path.join("src", "migrations", name);

// Build and run TypeORM command
const command = `ts-node ./node_modules/typeorm/cli.js migration:generate -d ${dataSourcePath} ${migrationsPath}`;
console.log("Running:", command);

execSync(command, { stdio: "inherit" });
