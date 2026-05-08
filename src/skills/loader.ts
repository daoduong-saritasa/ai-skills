import { readFileSync, readdirSync } from 'fs';
import { join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { Framework, SkillModule } from '../types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// When installed as npm package: content/ lives at package root (next to dist/)
// During development: content/ lives at project root
const CONTENT_ROOT = resolve(__dirname, '../content/rules');

function readModulesFromDir(dir: string, base: string): SkillModule[] {
  const modules: SkillModule[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const filePath = join(dir, file);
    const id = relative(base, filePath).replace(/\\/g, '/').replace(/\.md$/, '');
    const label = id.replace(/\//g, ' › ').replace(/-/g, ' ');
    const content = readFileSync(filePath, 'utf-8');
    modules.push({ id, label, content });
  }
  return modules;
}

export function loadCoreModules(): SkillModule[] {
  const dir = join(CONTENT_ROOT, 'core');
  return readModulesFromDir(dir, CONTENT_ROOT);
}

export function loadFrameworkModules(framework: Framework): SkillModule[] {
  const dir = join(CONTENT_ROOT, framework);
  return readModulesFromDir(dir, CONTENT_ROOT);
}

export function loadModuleById(id: string): SkillModule {
  const filePath = join(CONTENT_ROOT, `${id}.md`);
  const content = readFileSync(filePath, 'utf-8');
  const label = id.replace(/\//g, ' › ').replace(/-/g, ' ');
  return { id, label, content };
}
