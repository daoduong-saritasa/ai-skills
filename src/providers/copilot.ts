import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { SkillModule } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * GitHub Copilot — .github/skills/<name>/SKILL.md
 * Each module becomes its own agent skill directory.
 * https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills
 */
export function generateCopilot(modules: SkillModule[], targetDir: string): void {
  const skillsDir = join(targetDir, '.github', 'skills');

  for (const module of modules) {
    const name = toSkillName(module.id);
    const description = extractDescription(module);
    const dir = join(skillsDir, name);
    mkdirSync(dir, { recursive: true });

    const frontmatter = `---\nname: ${name}\ndescription: ${description}\n---\n\n`;
    writeFileSync(join(dir, 'SKILL.md'), frontmatter + module.content.trim(), 'utf-8');
  }
}
