import { runGenerate } from "./commands/generate.js";

const command = process.argv[2];

if (command && command !== "generate") {
  console.log(`
@daoduong-saritasa/fe-skills — AI skills platform for frontend projects

Usage:
  npx @daoduong-saritasa/fe-skills           Generate AI provider skill files for your tech stack
  npx @daoduong-saritasa/fe-skills generate  Generate AI provider skill files for your tech stack
`);
  process.exit(0);
}

await runGenerate();
