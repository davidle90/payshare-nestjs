const { execSync } = require("child_process");
const path = require("path");

// Arguments: app, module, migration name
const moduleName = process.argv[2]; // e.g., 'crm', 'inbox'
const migrationName = process.argv[3]; // e.g., 'CreateUsersTables'

if (!moduleName || !migrationName) {
  console.error("Usage: npm run migration:generate <module> <MigrationName>");
  console.error("Example: npm run migration:generate users CreateUsersTable");
  process.exit(1);
}

// Paths
const dataSourcePath = path.join("ormconfig.data-source.ts");
const migrationPath = path.join("src", "modules", moduleName, "migrations", migrationName);

// Quote paths for Windows compatibility
// Pass the module name as an extra argument to the DataSource
const command = `ts-node "${path.join("node_modules", "typeorm", "cli.js")}" migration:generate -d "${dataSourcePath}" "${migrationPath}" -- -m ${moduleName}`;

console.log("Running:", command);

try {
  execSync(command, { stdio: "inherit" });
} catch (err) {
  console.error("Migration generation failed:", err.message);
  process.exit(1);
}
