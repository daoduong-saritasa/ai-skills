import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { SkillModule } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Cursor — .cursor/rules/<name>.mdc
 * Each skill module becomes its own rule file.
 * alwaysApply: false lets Cursor load them contextually based on the description.
 */
export function generateCursor(modules: SkillModule[], targetDir: string): void {
  const dir = join(targetDir, '.cursor', 'rules');
  mkdirSync(dir, { recursive: true });

  for (const module of modules) {
    const name = toSkillName(module.id);
    const description = extractDescription(module);
    const frontmatter = `---\ndescription: ${description}\nalwaysApply: false\n---\n\n`;
    writeFileSync(join(dir, `${name}.mdc`), frontmatter + module.content.trim(), 'utf-8');
  }
}
