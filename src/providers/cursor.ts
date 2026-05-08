import { join } from 'path';
import type { SkillModule, GeneratedFile } from '../types.js';
import { extractDescription, toSkillName } from './utils.js';

/**
 * Cursor — .cursor/rules/<name>.mdc
 * alwaysApply: false lets Cursor load them contextually based on the description.
 */
export function buildCursorFiles(modules: SkillModule[], targetDir: string): GeneratedFile[] {
  const rulesDir = join(targetDir, '.cursor', 'rules');

  return modules.map((module) => {
    const name = toSkillName(module.id);
    const description = extractDescription(module);

    const build = (n: string) => ({
      path: join(rulesDir, `${n}.mdc`),
      content: `---\ndescription: ${description}\nalwaysApply: false\n---\n\n` + module.content.trim(),
    });

    return { skillName: name, ...build(name), rebuild: build };
  });
}
