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
