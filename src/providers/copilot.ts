import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName, buildExtraFiles } from './utils.js';

/**
 * GitHub Copilot — .github/skills/<name>/SKILL.md
 * https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills
 */
export function buildCopilotFiles(
  modules: SkillModule[],
  targetDir: string,
  referenceMap: Map<string, string>,
): GeneratedFile[] {
  const skillsDir = join(targetDir, '.github', 'skills');

  return modules.map((module) => {
    const name = toSkillName(module.id);
    const description = extractDescription(module);

    const build = (n: string) => {
      const skillDir = join(skillsDir, n);
      const extraFiles = buildExtraFiles(module, skillDir, referenceMap);
      return {
        path: join(skillDir, 'SKILL.md'),
        content: `---\nname: ${n}\ndescription: ${description}\n---\n\n` + module.content.trim(),
        ...(extraFiles.length > 0 && { extraFiles }),
      };
    };

    return { skillName: name, ...build(name), rebuild: build };
  });
}
