import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { SkillModule } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Windsurf — .windsurf/rules/<name>.md
 * Each skill module becomes its own rule file.
 */
export function generateWindsurf(modules: SkillModule[], targetDir: string): void {
  const dir = join(targetDir, '.windsurf', 'rules');
  mkdirSync(dir, { recursive: true });

  for (const module of modules) {
    const name = toSkillName(module.id);
    const description = extractDescription(module);
    const frontmatter = `---\ndescription: ${description}\n---\n\n`;
    writeFileSync(join(dir, `${name}.md`), frontmatter + module.content.trim(), 'utf-8');
  }
}
