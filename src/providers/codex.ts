import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Codex — .agents/skills/<name>/SKILL.md
 * https://developers.openai.com/codex/skills
 */
export function buildCodexFiles(modules: SkillModule[], targetDir: string): GeneratedFile[] {
  const skillsDir = join(targetDir, '.agents', 'skills');

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
