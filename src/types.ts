export type Framework = 'angular' | 'react' | 'vue';

export type Provider = 'copilot' | 'cursor' | 'claude' | 'codex' | 'windsurf';

export interface Manifest {
  version: string;
  framework: Framework;
  skills: string[];
}

export interface SkillModule {
  /** e.g. "core/architecture" */
  id: string;
  /** Human-readable label */
  label: string;
  /** Markdown content */
  content: string;
}

export interface GeneratedFile {
  /** Skill name slug used as key and shown in conflict prompts */
  skillName: string;
  /** Absolute path where the file will be written */
  path: string;
  /** Final file content (including any frontmatter) */
  content: string;
  /** Rebuild path + content under a different skill name (for rename) */
  rebuild: (newName: string) => { path: string; content: string };
}
