import { intro, outro, select, text, spinner, log } from '@clack/prompts';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Framework, Provider, GeneratedFile, SkillGroup } from '../types.js';
import { loadCoreModules, loadFrameworkModules } from '../skills/loader.js';
import { buildCopilotFiles } from '../providers/copilot.js';
import { buildCursorFiles } from '../providers/cursor.js';
import { buildClaudeFiles } from '../providers/claude.js';
import { buildCodexFiles } from '../providers/codex.js';
import { buildWindsurfFiles } from '../providers/windsurf.js';

const PROVIDER_OUTPUT: Record<Provider, string> = {
  copilot: '.github/skills/<name>/SKILL.md',
  cursor: '.cursor/rules/<name>/SKILL.mdc',
  claude: '.claude/skills/<name>/SKILL.md',
  codex: '.agents/skills/<name>/SKILL.md',
  windsurf: '.windsurf/rules/<name>/SKILL.md',
};

export async function runGenerate(targetDir: string = process.cwd()): Promise<void> {
  intro('fe-skills generate — generate AI provider skill files for your tech stack');

  // 1. Select framework
  const fw = await select<Framework>({
    message: 'Which frontend framework does this project use?',
    options: [
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'none', label: 'No framework', hint: 'core skills only' },
    ],
  });

  if (typeof fw === 'symbol') process.exit(0);

  const isNoFramework = fw === 'none';
  const fwLabel = isNoFramework ? 'Core' : fw.charAt(0).toUpperCase() + fw.slice(1);

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

  // 3. Load skill modules directly from package content
  const coreModules = loadCoreModules();
  const frameworkModules = isNoFramework ? [] : loadFrameworkModules(fw);
  const allModules = [...coreModules, ...frameworkModules];

  const coreRaw = allModules.filter((m) => m.id.startsWith('core/'));
  const frameworkRaw = allModules.filter((m) => !m.id.startsWith('core/'));

  const groups: SkillGroup[] = [
    {
      id: isNoFramework ? 'core/frontend-developer' : `${fw}/frontend-developer`,
      label: `${fwLabel} Frontend Developer`,
      modules: [...coreRaw, ...frameworkRaw],
    },
  ];

  log.info(`Framework: ${fw}  |  Modules: ${allModules.length} → 1 skill`);

  // 3b. Build planned file list (no writes yet)
  const builders: Record<Provider, (g: SkillGroup[], d: string, r: Map<string, string>) => GeneratedFile[]> = {
    copilot: buildCopilotFiles,
    cursor: buildCursorFiles,
    claude: buildClaudeFiles,
    codex: buildCodexFiles,
    windsurf: buildWindsurfFiles,
  };
  const planned = builders[provider](groups, targetDir, new Map());

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
      toWrite.push({ ...file, skillName: newName.trim(), ...rebuilt, extraFiles: rebuilt.extraFiles });
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
    for (const extra of file.extraFiles ?? []) {
      mkdirSync(dirname(extra.path), { recursive: true });
      writeFileSync(extra.path, extra.content, 'utf-8');
    }
  }

  s.stop('Files written');
  log.success(`${toWrite.length} skill(s) written → ${PROVIDER_OUTPUT[provider]}`);
  outro('Done! Your AI provider is now loaded with the team skills.');
}
