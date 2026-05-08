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
