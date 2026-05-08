import { join } from 'path';
import type { SkillModule } from '../types.js';

/** Compose a single markdown document from skill modules */
export function composeSections(modules: SkillModule[]): string {
  return modules
    .map((m) => m.content.trim())
    .join('\n\n---\n\n');
}

/**
 * Extract the H1 heading from markdown content and turn it into a
 * one-line skill description suitable for YAML frontmatter.
 * Falls back to the module label if no heading is found.
 */
export function extractDescription(module: SkillModule): string {
  const match = module.content.match(/^#\s+(.+)$/m);
  const heading = match ? match[1].trim() : module.label;
  return `${heading}. Use when working on ${heading.toLowerCase().replace(/^(angular|react|vue)\s+/i, '$1 ')}.`;
}

/** Convert a module id to a SKILL.md-compatible name (lowercase, hyphens only) */
export function toSkillName(id: string): string {
  return id.replace(/\//g, '-').toLowerCase();
}

/**
 * Parse all `references/<name>.md` links in the module content, resolve each
 * against the referenceMap (keyed as "<category>/<name>"), and return the
 * extra files to write into the skill's references/ subfolder.
 */
export function buildExtraFiles(
  module: SkillModule,
  skillDir: string,
  referenceMap: Map<string, string>,
): { path: string; content: string }[] {
  const category = module.id.split('/')[0];
  const pattern = /`references\/([^`\s]+\.md)`/g;
  const extraFiles: { path: string; content: string }[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(module.content)) !== null) {
    const fileName = match[1]; // e.g. "secure-parse.md"
    const baseName = fileName.replace(/\.md$/, ''); // "secure-parse"
    const refId = `${category}/${baseName}`;
    if (seen.has(refId)) continue;
    seen.add(refId);
    const content = referenceMap.get(refId);
    if (content) {
      extraFiles.push({ path: join(skillDir, 'references', fileName), content });
    }
  }

  return extraFiles;
}
