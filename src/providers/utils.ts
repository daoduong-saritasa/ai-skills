import { join } from 'path';
import type { SkillModule, SkillGroup } from '../types.js';

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
 * Build SKILL.md guide content and extraFiles for a skill group.
 *
 * SKILL.md becomes an index that tells the AI which reference file to use for
 * each topic. Each individual rule module is written as its own file under
 * references/, and any additional example files referenced inside the rules
 * (from the referenceMap) are included too.
 */
export function buildGroupContent(
  group: SkillGroup,
  skillDir: string,
  referenceMap: Map<string, string>,
): { guideContent: string; extraFiles: { path: string; content: string }[] } {
  const category = group.id.split('/')[0]; // 'core' | 'react' | 'angular' | 'vue'
  const extraFiles: { path: string; content: string }[] = [];
  const seenPaths = new Set<string>();
  const sections: string[] = [];

  for (const module of group.modules) {
    const basename = module.id.split('/').pop()!; // e.g. 'accessibility'
    const ruleFileName = `${basename}.md`;
    const rulePath = join(skillDir, 'references', ruleFileName);

    // Merge rule content with its matching examples from the referenceMap (same basename)
    const examplesContent = referenceMap.get(`${category}/${basename}`);
    const combinedContent = examplesContent
      ? `${module.content.trim()}\n\n---\n\n${examplesContent.trim()}`
      : module.content;

    if (!seenPaths.has(rulePath)) {
      seenPaths.add(rulePath);
      extraFiles.push({ path: rulePath, content: combinedContent });
    }

    // Extract H1 heading for the guide section title
    const headingMatch = module.content.match(/^#\s+(.+)$/m);
    const heading = headingMatch ? headingMatch[1].trim() : module.label;

    // Find additional example/reference files linked inside the rule content
    // Skip self-references (same basename) — already merged above
    const additionalRefLinks: string[] = [];
    const pattern = /`references\/([^`\s]+\.md)`/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(module.content)) !== null) {
      const fileName = match[1]; // e.g. 'secure-parse.md'
      if (fileName === ruleFileName) continue; // already merged above
      const refPath = join(skillDir, 'references', fileName);
      if (!seenPaths.has(refPath)) {
        seenPaths.add(refPath);
        const content = referenceMap.get(`${category}/${fileName.replace(/\.md$/, '')}`);
        if (content) {
          extraFiles.push({ path: refPath, content });
          additionalRefLinks.push(`\`references/${fileName}\``);
        }
      }
    }

    // Build guide entry for this rule
    let section = `### ${heading}\n- Rules & examples: \`references/${ruleFileName}\``;
    if (additionalRefLinks.length > 0) {
      section += `\n- Additional references: ${additionalRefLinks.join(', ')}`;
    }
    sections.push(section);
  }

  const guideContent = `# ${group.label}\n\n## Rules Index\n\n${sections.join('\n\n')}`;
  return { guideContent, extraFiles };
}
