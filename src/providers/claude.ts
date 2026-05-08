import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { SkillModule } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Claude Code — .claude/skills/<name>/SKILL.md
 * Claude Code supports the same agent skills directory format as Copilot.
 * Each module becomes its own skill with a description so Claude loads it when relevant.
 */
export function generateClaude(modules: SkillModule[], targetDir: string): void {
  const skillsDir = join(targetDir, '.claude', 'skills');

  for (const module of modules) {
    const name = toSkillName(module.id);
    const description = extractDescription(module);
    const dir = join(skillsDir, name);
    mkdirSync(dir, { recursive: true });

    const frontmatter = `---\nname: ${name}\ndescription: ${description}\n---\n\n`;
    writeFileSync(join(dir, 'SKILL.md'), frontmatter + module.content.trim(), 'utf-8');
  }
}
