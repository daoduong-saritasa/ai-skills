import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName, buildExtraFiles } from './utils.js';

/**
 * Windsurf — .windsurf/rules/<name>.md
 */
export function buildWindsurfFiles(
  modules: SkillModule[],
  targetDir: string,
  referenceMap: Map<string, string>,
): GeneratedFile[] {
  const rulesDir = join(targetDir, '.windsurf', 'rules');

  return modules.map((module) => {
    const name = toSkillName(module.id);
    const description = extractDescription(module);

    const build = (n: string) => {
      const skillDir = join(rulesDir, n);
      const extraFiles = buildExtraFiles(module, skillDir, referenceMap);
      return {
        path: join(skillDir, 'SKILL.md'),
        content: `---\ndescription: ${description}\n---\n\n` + module.content.trim(),
        ...(extraFiles.length > 0 && { extraFiles }),
      };
    };

    return { skillName: name, ...build(name), rebuild: build };
  });
}
