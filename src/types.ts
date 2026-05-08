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
  /** Absolute path where the main SKILL file will be written */
  path: string;
  /** Final file content (including any frontmatter) */
  content: string;
  /** Additional files (e.g. references/) to write alongside the main file */
  extraFiles?: { path: string; content: string }[];
  /** Rebuild path + content (+ extraFiles) under a different skill name (for rename) */
  rebuild: (newName: string) => { path: string; content: string; extraFiles?: { path: string; content: string }[] };
}
