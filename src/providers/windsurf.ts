import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Windsurf — .windsurf/rules/<name>.md
 */
export function buildWindsurfFiles(modules: SkillModule[], targetDir: string): GeneratedFile[] {
  const rulesDir = join(targetDir, '.windsurf', 'rules');

  return modules.map((module) => {
    const name = toSkillName(module.id);
    const description = extractDescription(module);

    const build = (n: string) => ({
      path: join(rulesDir, `${n}.md`),
      content: `---\ndescription: ${description}\n---\n\n` + module.content.trim(),
    });

    return { skillName: name, ...build(name), rebuild: build };
  });
}
