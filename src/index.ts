import { runInit } from "./commands/init.js";
import { runGenerate } from "./commands/generate.js";

const command = process.argv[2];

switch (command) {
  case "init":
    await runInit();
    break;
  case "generate":
    await runGenerate();
    break;
  default:
    console.log(`
@daoduong-saritasa/fe-skills — AI skills platform for frontend projects

Usage:
  npx @daoduong-saritasa/fe-skills init       Set up .ai/ skills for this project (commit to git)
  npx @daoduong-saritasa/fe-skills generate   Generate AI provider files from .ai/ (run per-dev, gitignored)
`);
    process.exit(0);
}
