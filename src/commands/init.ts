import { intro, outro, select, confirm, spinner, log } from '@clack/prompts';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import type { Framework, Manifest } from '../types.js';
import { loadCoreModules, loadFrameworkModules, loadCoreReferences, loadFrameworkReferences } from '../skills/loader.js';

const PACKAGE_VERSION = '0.1.0';

export async function runInit(targetDir: string = process.cwd()): Promise<void> {
  intro('fe-skills init — set up AI skills for your project');

  const aiDir = join(targetDir, '.ai');

  // Warn if .ai/ already exists
  if (existsSync(join(aiDir, 'manifest.json'))) {
    log.warn('.ai/manifest.json already exists.');
    const ok = await confirm({
      message: 'Overwrite existing skills with a fresh setup?',
      initialValue: false,
    });
    if (!ok || typeof ok === 'symbol') {
      log.info('Cancelled. Your existing .ai/ folder was not changed.');
      process.exit(0);
    }
  }

  // 1. Select framework
  const framework = await select<Framework>({
    message: 'Which frontend framework does this project use?',
    options: [
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'none', label: 'No framework', hint: 'core skills only' },
    ],
  });

  if (typeof framework === 'symbol') process.exit(0);

  // Core + selected framework modules are always included — no picking
  const coreModules = loadCoreModules();
  const frameworkModules = framework !== 'none' ? loadFrameworkModules(framework) : [];
  const allModules = [...coreModules, ...frameworkModules];

  const coreReferences = loadCoreReferences();
  const frameworkReferences = framework !== 'none' ? loadFrameworkReferences(framework) : [];
  const allReferences = [...coreReferences, ...frameworkReferences];

  const s = spinner();
  s.start('Writing .ai/ folder…');

  const rulesDir = join(aiDir, 'rules');
  mkdirSync(rulesDir, { recursive: true });

  // Write all core + framework skill files into .ai/rules/
  for (const module of allModules) {
    const dest = join(rulesDir, `${module.id}.md`);
    mkdirSync(resolve(dest, '..'), { recursive: true });
    writeFileSync(dest, module.content, 'utf-8');
  }

  // Write all core + framework reference files into .ai/references/
  const referencesDir = join(aiDir, 'references');
  for (const ref of allReferences) {
    const dest = join(referencesDir, `${ref.id}.md`);
    mkdirSync(resolve(dest, '..'), { recursive: true });
    writeFileSync(dest, ref.content, 'utf-8');
  }

  // Write manifest
  const manifest: Manifest = {
    version: PACKAGE_VERSION,
    framework,
    skills: allModules.map((m) => m.id),
  };
  writeFileSync(join(aiDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  s.stop('.ai/ folder created');

  log.success(`Manifest written to .ai/manifest.json`);
  log.info(`Commit the .ai/ folder to git so your whole team shares the same skills.`);
  log.info(`Each dev runs  npx @daoduong-saritasa/fe-skills generate  to create their own AI provider files.`);

  outro('Done!');
}
