import { join } from 'path';
import type { SkillGroup, GeneratedFile } from '../types.js';
import { toSkillName, buildGroupContent } from './utils.js';

/**
 * GitHub Copilot — .github/skills/<name>/SKILL.md
 * https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills
 */
export function buildCopilotFiles(
  groups: SkillGroup[],
  targetDir: string,
  referenceMap: Map<string, string>,
): GeneratedFile[] {
  const skillsDir = join(targetDir, '.github', 'skills');

  return groups.map((group) => {
    const name = toSkillName(group.id);
    const description = `${group.label}. Use when working on ${group.label.toLowerCase()}.`;

    const build = (n: string) => {
      const skillDir = join(skillsDir, n);
      const { guideContent, extraFiles } = buildGroupContent(group, skillDir, referenceMap);
      return {
        path: join(skillDir, 'SKILL.md'),
        content: `---\nname: ${n}\ndescription: ${description}\n---\n\n` + guideContent,
        ...(extraFiles.length > 0 && { extraFiles }),
      };
    };

    return { skillName: name, ...build(name), rebuild: build };
  });
}
