import { intro, outro, select, confirm, spinner, log } from '@clack/prompts';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Manifest, Provider } from '../types.js';
import { loadModuleById } from '../skills/loader.js';
import { generateCopilot } from '../providers/copilot.js';
import { generateCursor } from '../providers/cursor.js';
import { generateClaude } from '../providers/claude.js';
import { generateCodex } from '../providers/codex.js';
import { generateWindsurf } from '../providers/windsurf.js';

const PROVIDER_OUTPUT: Record<Provider, string> = {
  copilot: '.github/skills/<name>/SKILL.md',
  cursor: '.cursor/rules/<name>.mdc',
  claude: '.claude/skills/<name>/SKILL.md',
  codex: 'AGENTS.md',
  windsurf: '.windsurf/rules/<name>.md',
};

/** Root directory that each provider writes into */
const PROVIDER_DIR: Record<Provider, string> = {
  copilot: '.github/skills',
  cursor: '.cursor/rules',
  claude: '.claude/skills',
  codex: '',          // single file, checked separately
  windsurf: '.windsurf/rules',
};

export async function runGenerate(targetDir: string = process.cwd()): Promise<void> {
  intro('fe-skills generate — create AI provider files from .ai/');

  // 1. Read manifest
  const manifestPath = join(targetDir, '.ai', 'manifest.json');
  if (!existsSync(manifestPath)) {
    log.error(
      'No .ai/manifest.json found. Run  npx @daoduong-saritasa/fe-skills init  first to set up the project.',
    );
    process.exit(1);
  }

  const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  log.info(`Framework: ${manifest.framework}  |  Skills: ${manifest.skills.length} modules`);

  // 2. Select provider
  const provider = await select<Provider>({
    message: 'Which AI provider do you use?',
    options: [
      { value: 'copilot', label: 'GitHub Copilot', hint: PROVIDER_OUTPUT.copilot },
      { value: 'cursor', label: 'Cursor', hint: PROVIDER_OUTPUT.cursor },
      { value: 'claude', label: 'Claude Code', hint: PROVIDER_OUTPUT.claude },
      { value: 'codex', label: 'Codex / AGENTS.md', hint: PROVIDER_OUTPUT.codex },
      { value: 'windsurf', label: 'Windsurf', hint: PROVIDER_OUTPUT.windsurf },
    ],
  });

  if (typeof provider === 'symbol') process.exit(0);

  // Check if provider output already has files and confirm overwrite
  const providerDir = PROVIDER_DIR[provider];
  const existingPath = providerDir
    ? join(targetDir, providerDir)
    : join(targetDir, 'AGENTS.md');

  if (existsSync(existingPath)) {
    const label = providerDir || 'AGENTS.md';
    log.warn(`${label} already exists.`);
    log.info('Files matching your skill module names will be overwritten. Any other custom skills in that folder will be left untouched.');
    const ok = await confirm({
      message: 'Continue and overwrite generated skill files?',
      initialValue: true,
    });
    if (!ok || typeof ok === 'symbol') {
      log.info('Cancelled. No files were changed.');
      process.exit(0);
    }
  }

  const s = spinner();
  s.start(`Generating ${provider} files…`);

  // 3. Load selected skill modules from .ai/rules/
  const modules = manifest.skills.map((id) => {
    const filePath = join(targetDir, '.ai', 'rules', `${id}.md`);
    const content = readFileSync(filePath, 'utf-8');
    return {
      id,
      label: id.replace(/\//g, ' › ').replace(/-/g, ' '),
      content,
    };
  });

  // 4. Generate provider files
  switch (provider) {
    case 'copilot':
      generateCopilot(modules, targetDir);
      break;
    case 'cursor':
      generateCursor(modules, targetDir);
      break;
    case 'claude':
      generateClaude(modules, targetDir);
      break;
    case 'codex':
      generateCodex(modules, targetDir);
      break;
    case 'windsurf':
      generateWindsurf(modules, targetDir);
      break;
  }

  s.stop('Files generated');

  log.success(`Output: ${PROVIDER_OUTPUT[provider]}`);

  outro('Done! Your AI provider is now loaded with the team skills.');
}
