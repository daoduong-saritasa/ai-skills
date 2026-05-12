import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { Framework, SkillModule } from '../types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// When installed as npm package: content/ lives at package root (next to dist/)
// During development: content/ lives at project root
const CONTENT_ROOT = resolve(__dirname, '../content');

/**
 * Load all topic files from content/<category>/*.md.
 * Each file contains rules + examples merged by a --- separator.
 * Module id is "<category>/<topic>".
 */
function loadFromCategory(category: string): SkillModule[] {
  const categoryDir = join(CONTENT_ROOT, category);
  const modules: SkillModule[] = [];
  for (const file of readdirSync(categoryDir)) {
    if (!file.endsWith('.md')) continue;
    const id = `${category}/${file.replace(/\.md$/, '')}`;
    const label = id.replace(/\//g, ' › ').replace(/-/g, ' ');
    const content = readFileSync(join(categoryDir, file), 'utf-8');
    modules.push({ id, label, content });
  }
  return modules;
}

export function loadCoreModules(): SkillModule[] {
  return loadFromCategory('core');
}

export function loadFrameworkModules(framework: Framework): SkillModule[] {
  return loadFromCategory(framework);
}

// References are now merged into the topic file itself — nothing extra to load.
export function loadCoreReferences(): SkillModule[] {
  return [];
}

export function loadFrameworkReferences(_framework: Framework): SkillModule[] {
  return [];
}
