import { join } from 'path';
import type { SkillGroup, GeneratedFile } from '../types.js';
import { toSkillName, buildGroupContent } from './utils.js';

/**
 * Cursor — .cursor/rules/<name>/SKILL.mdc
 * alwaysApply: false lets Cursor load them contextually based on the description.
 */
export function buildCursorFiles(
  groups: SkillGroup[],
  targetDir: string,
  referenceMap: Map<string, string>,
): GeneratedFile[] {
  const rulesDir = join(targetDir, '.cursor', 'rules');

  return groups.map((group) => {
    const name = toSkillName(group.id);
    const description = `${group.label}. Use when working on ${group.label.toLowerCase()}.`;

    const build = (n: string) => {
      const skillDir = join(rulesDir, n);
      const { guideContent, extraFiles } = buildGroupContent(group, skillDir, referenceMap);
      return {
        path: join(skillDir, 'SKILL.mdc'),
        content: `---\ndescription: ${description}\nalwaysApply: false\n---\n\n` + guideContent,
        ...(extraFiles.length > 0 && { extraFiles }),
      };
    };

    return { skillName: name, ...build(name), rebuild: build };
  });
}
