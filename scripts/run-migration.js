const { execSync } = require("child_process");
const path = require("path");

// Read arguments: action and app name
const action = process.argv[2]; // 'run' or 'revert'

if (!action) {
  console.error("Usage: npm run migration:<run|revert>");
  console.error("Example: npm run migration:run");
  process.exit(1);
}

if (!["run", "revert"].includes(action)) {
  console.error("Action must be 'run' or 'revert'");
  process.exit(1);
}

// Resolve path to app's DataSource
const dataSourcePath = path.join("ormconfig.data-source.ts");

// Build and run TypeORM command
const command = `ts-node ./node_modules/typeorm/cli.js migration:${action} -d ${dataSourcePath}`;
console.log("Running:", command);

execSync(command, { stdio: "inherit" });
