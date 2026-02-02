/**
 * Init Command - Initializes component registry in target project
 */

import path from 'path';
import prompts from 'prompts';
import { 
  logger, 
  createSpinner, 
  detectProject, 
  fileExists, 
  ensureDir, 
  writeFile, 
  readJsonFile,
  getInstallCommand 
} from '../utils';
import { SHARED_DEPENDENCY_PACKAGES } from '../types';
import { SHARED_FILES } from '../templates/shared';

export interface InitOptions {
  cwd?: string;
  yes?: boolean;
}

async function promptForConfig(): Promise<{ componentsDir: string; proceed: boolean }> {
  const response = await prompts([
    {
      type: 'text',
      name: 'componentsDir',
      message: 'Where would you like to install components?',
      initial: 'src/components/sections',
    },
    {
      type: 'confirm',
      name: 'proceed',
      message: 'This will create shared utilities and types. Continue?',
      initial: true,
    },
  ]);

  return {
    componentsDir: response.componentsDir ?? 'src/components/sections',
    proceed: response.proceed ?? false,
  };
}

async function createConfigFile(projectRoot: string, componentsDir: string): Promise<void> {
  const configPath = path.join(projectRoot, 'comp-cli.json');
  const config = {
    $schema: 'https://raw.githubusercontent.com/comp-cli/schema.json',
    componentsDir,
    installedSections: [],
  };
  await writeFile(configPath, JSON.stringify(config, null, 2));
}

async function installSharedFiles(componentsDir: string): Promise<void> {
  // Create directory structure
  const dirs = ['', 'types', 'utils', 'hooks', 'styles', 'components'];
  for (const dir of dirs) {
    await ensureDir(path.join(componentsDir, dir));
  }

  // Write shared files - keys match SHARED_FILES object
  const fileMappings: Array<{ templateKey: string; filePath: string }> = [
    { templateKey: 'types/index.ts', filePath: path.join(componentsDir, 'types', 'index.ts') },
    { templateKey: 'utils/index.ts', filePath: path.join(componentsDir, 'utils', 'index.ts') },
    { templateKey: 'utils/validation.ts', filePath: path.join(componentsDir, 'utils', 'validation.ts') },
    { templateKey: 'hooks/index.ts', filePath: path.join(componentsDir, 'hooks', 'index.ts') },
    { templateKey: 'styles/index.ts', filePath: path.join(componentsDir, 'styles', 'index.ts') },
    { templateKey: 'components/primitives.tsx', filePath: path.join(componentsDir, 'components', 'primitives.tsx') },
  ];

  for (const { templateKey, filePath } of fileMappings) {
    const content = SHARED_FILES[templateKey as keyof typeof SHARED_FILES];
    if (content) {
      await writeFile(filePath, content);
    }
  }
}

async function updatePackageJson(projectRoot: string): Promise<string[]> {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = await readJsonFile<{ dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>(packageJsonPath);
  
  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};
  
  // Check which dependencies need to be installed
  const missingDeps: string[] = [];
  
  for (const dep of SHARED_DEPENDENCY_PACKAGES) {
    if (!dependencies[dep] && !devDependencies[dep]) {
      missingDeps.push(dep);
    }
  }

  return missingDeps;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  
  logger.info('Initializing component registry...\n');

  // Check if already initialized
  const configPath = path.join(cwd, 'comp-cli.json');
  if (await fileExists(configPath)) {
    logger.warn('Project already initialized. Use "add" to install sections.');
    return;
  }

  // Detect project
  const spinner = createSpinner('Detecting project configuration...');
  spinner.start();

  const projectConfig = await detectProject(cwd);
  
  if (!projectConfig) {
    spinner.fail('Could not detect project configuration.');
    logger.error('Please run this command in a Next.js or React TypeScript project.');
    return;
  }

  spinner.succeed(`Detected ${projectConfig.framework}${projectConfig.routerType ? ` (${projectConfig.routerType})` : ''} project`);

  // Get user config
  let componentsDir: string;
  let proceed: boolean;

  if (options.yes) {
    componentsDir = 'src/components/sections';
    proceed = true;
  } else {
    const response = await promptForConfig();
    componentsDir = response.componentsDir;
    proceed = response.proceed;
  }

  if (!proceed) {
    logger.info('Initialization cancelled.');
    return;
  }

  const absoluteComponentsDir = path.join(cwd, componentsDir);

  // Create config file
  const configSpinner = createSpinner('Creating configuration...');
  configSpinner.start();
  await createConfigFile(cwd, componentsDir);
  configSpinner.succeed('Created comp-cli.json');

  // Install shared files
  const sharedSpinner = createSpinner('Installing shared utilities...');
  sharedSpinner.start();
  await installSharedFiles(absoluteComponentsDir);
  sharedSpinner.succeed('Installed shared utilities');

  // Check for missing dependencies
  const missingDeps = await updatePackageJson(cwd);
  
  if (missingDeps.length > 0) {
    logger.info('\n📦 Required dependencies:');
    logger.info(`   ${missingDeps.join(', ')}`);
    logger.info(`\n   Run: ${getInstallCommand(projectConfig.packageManager, missingDeps)}`);
  }

  // Success message
  logger.success('\n✨ Initialization complete!\n');
  logger.info('Next steps:');
  logger.info(`  1. ${missingDeps.length > 0 ? 'Install the dependencies above' : 'Dependencies already installed'}`);
  logger.info('  2. Add sections with: npx comp-cli add <section>');
  logger.info('  3. Available sections: hero, about, contact, booking, footer\n');
}
