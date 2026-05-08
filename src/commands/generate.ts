import { intro, outro, select, text, spinner, log } from '@clack/prompts';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Manifest, Provider, GeneratedFile } from '../types.js';
import { buildCopilotFiles } from '../providers/copilot.js';
import { buildCursorFiles } from '../providers/cursor.js';
import { buildClaudeFiles } from '../providers/claude.js';
import { buildCodexFiles } from '../providers/codex.js';
import { buildWindsurfFiles } from '../providers/windsurf.js';

const PROVIDER_OUTPUT: Record<Provider, string> = {
  copilot: '.github/skills/<name>/SKILL.md',
  cursor: '.cursor/rules/<name>.mdc',
  claude: '.claude/skills/<name>/SKILL.md',
  codex: '.agents/skills/<name>/SKILL.md',
  windsurf: '.windsurf/rules/<name>.md',
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
      { value: 'codex', label: 'Codex', hint: PROVIDER_OUTPUT.codex },
      { value: 'windsurf', label: 'Windsurf', hint: PROVIDER_OUTPUT.windsurf },
    ],
  });

  if (typeof provider === 'symbol') process.exit(0);

  // 3. Load skill modules from .ai/rules/
  const modules = manifest.skills.map((id) => {
    const filePath = join(targetDir, '.ai', 'rules', `${id}.md`);
    const content = readFileSync(filePath, 'utf-8');
    return { id, label: id.replace(/\//g, ' › ').replace(/-/g, ' '), content };
  });

  // 4. Build planned file list (no writes yet)
  const builders: Record<Provider, (m: typeof modules, d: string) => GeneratedFile[]> = {
    copilot: buildCopilotFiles,
    cursor: buildCursorFiles,
    claude: buildClaudeFiles,
    codex: buildCodexFiles,
    windsurf: buildWindsurfFiles,
  };
  const planned = builders[provider](modules, targetDir);

  // 5. Conflict resolution — per skill, before writing anything
  const toWrite: GeneratedFile[] = [];

  for (const file of planned) {
    if (!existsSync(file.path)) {
      toWrite.push(file);
      continue;
    }

    const action = await select<'replace' | 'rename' | 'skip'>({
      message: `Skill "${file.skillName}" already exists. What do you want to do?`,
      options: [
        { value: 'replace', label: 'Replace it with the new version' },
        { value: 'rename', label: 'Save new one under a different name' },
        { value: 'skip', label: 'Skip — keep existing' },
      ],
    });

    if (typeof action === 'symbol' || action === 'skip') continue;

    if (action === 'replace') {
      toWrite.push(file);
    } else {
      const newName = await text({
        message: `New skill name for "${file.skillName}":`,
        placeholder: `${file.skillName}-new`,
        validate: (v) => (v.trim().length === 0 ? 'Name cannot be empty' : undefined),
      });
      if (typeof newName === 'symbol') continue;
      const rebuilt = file.rebuild(newName.trim());
      toWrite.push({ ...file, skillName: newName.trim(), ...rebuilt });
    }
  }

  if (toWrite.length === 0) {
    log.info('Nothing to write.');
    outro('Done.');
    return;
  }

  // 6. Write resolved files
  const s = spinner();
  s.start(`Writing ${toWrite.length} skill file(s)…`);

  for (const file of toWrite) {
    mkdirSync(dirname(file.path), { recursive: true });
    writeFileSync(file.path, file.content, 'utf-8');
  }

  s.stop('Files written');
  log.success(`${toWrite.length} skill(s) written → ${PROVIDER_OUTPUT[provider]}`);
  outro('Done! Your AI provider is now loaded with the team skills.');
}
