import { join } from 'path';
import type { SkillGroup, GeneratedFile } from '../types.js';
import { toSkillName, buildGroupContent } from './utils.js';

/**
 * Claude Code — .claude/skills/<name>/SKILL.md
 * Same agent skills directory format as Copilot.
 */
export function buildClaudeFiles(
  groups: SkillGroup[],
  targetDir: string,
  referenceMap: Map<string, string>,
): GeneratedFile[] {
  const skillsDir = join(targetDir, '.claude', 'skills');

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
