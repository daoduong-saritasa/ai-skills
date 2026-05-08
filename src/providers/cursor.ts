import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName, buildExtraFiles } from './utils.js';

/**
 * Cursor — .cursor/rules/<name>.mdc
 * alwaysApply: false lets Cursor load them contextually based on the description.
 */
export function buildCursorFiles(
  modules: SkillModule[],
  targetDir: string,
  referenceMap: Map<string, string>,
): GeneratedFile[] {
  const rulesDir = join(targetDir, '.cursor', 'rules');

  return modules.map((module) => {
    const name = toSkillName(module.id);
    const description = extractDescription(module);

    const build = (n: string) => {
      const skillDir = join(rulesDir, n);
      const extraFiles = buildExtraFiles(module, skillDir, referenceMap);
      return {
        path: join(skillDir, 'SKILL.mdc'),
        content: `---\ndescription: ${description}\nalwaysApply: false\n---\n\n` + module.content.trim(),
        ...(extraFiles.length > 0 && { extraFiles }),
      };
    };

    return { skillName: name, ...build(name), rebuild: build };
  });
}
