import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Claude Code — .claude/skills/<name>/SKILL.md
 * Same agent skills directory format as Copilot.
 */
export function buildClaudeFiles(modules: SkillModule[], targetDir: string): GeneratedFile[] {
  const skillsDir = join(targetDir, '.claude', 'skills');

  return modules.map((module) => {
    const name = toSkillName(module.id);
    const description = extractDescription(module);

    const build = (n: string) => ({
      path: join(skillsDir, n, 'SKILL.md'),
      content: `---\nname: ${n}\ndescription: ${description}\n---\n\n` + module.content.trim(),
    });

    return { skillName: name, ...build(name), rebuild: build };
  });
}
