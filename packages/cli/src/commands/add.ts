/**
 * Add Command - Adds section components to project
 */

import path from 'path';
import prompts from 'prompts';
import { 
  logger, 
  createSpinner, 
  fileExists, 
  ensureDir, 
  writeFile, 
  readJsonFile,
  writeJsonFile 
} from '../utils';
import { SECTION_NAMES, type SectionName } from '../types';
import { 
  HERO_TEMPLATES,
  ABOUT_TEMPLATES,
  CONTACT_TEMPLATES,
  BOOKING_TEMPLATES,
  FOOTER_TEMPLATES
} from '../templates';

export interface AddOptions {
  cwd?: string;
  all?: boolean;
  overwrite?: boolean;
}

interface CliConfig {
  componentsDir: string;
  installedSections: string[];
}

const SECTION_TEMPLATES: Record<SectionName, Record<string, string>> = {
  hero: HERO_TEMPLATES,
  about: ABOUT_TEMPLATES,
  contact: CONTACT_TEMPLATES,
  booking: BOOKING_TEMPLATES,
  footer: FOOTER_TEMPLATES,
};

async function getConfig(cwd: string): Promise<CliConfig | null> {
  const configPath = path.join(cwd, 'comp-cli.json');
  
  if (!(await fileExists(configPath))) {
    return null;
  }

  try {
    return await readJsonFile(configPath);
  } catch {
    return null;
  }
}

async function updateConfig(cwd: string, installedSections: string[]): Promise<void> {
  const configPath = path.join(cwd, 'comp-cli.json');
  const config = await readJsonFile<CliConfig>(configPath);
  const existingSections = config.installedSections ?? [];
  config.installedSections = [...new Set([...existingSections, ...installedSections])];
  await writeJsonFile(configPath, config);
}

async function installSection(
  sectionName: SectionName, 
  componentsDir: string, 
  overwrite: boolean
): Promise<boolean> {
  const templates = SECTION_TEMPLATES[sectionName];
  
  if (!templates) {
    logger.error(`Unknown section: ${sectionName}`);
    return false;
  }

  // Capitalize first letter for folder name
  const folderName = sectionName.charAt(0).toLowerCase() + sectionName.slice(1);
  const sectionDir = path.join(componentsDir, folderName);

  // Check if section already exists
  if (!overwrite && await fileExists(sectionDir)) {
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: `Section "${sectionName}" already exists. Overwrite?`,
      initial: false,
    });

    if (!proceed) {
      logger.info(`Skipping ${sectionName}`);
      return false;
    }
  }

  // Create section directory
  await ensureDir(sectionDir);

  // Write template files
  for (const [filename, content] of Object.entries(templates)) {
    const filePath = path.join(sectionDir, filename);
    await writeFile(filePath, content);
  }

  return true;
}

async function selectSections(installedSections: string[]): Promise<SectionName[]> {
  const choices = SECTION_NAMES.map(section => ({
    title: section.charAt(0).toUpperCase() + section.slice(1),
    value: section,
    description: installedSections.includes(section) ? '(already installed)' : undefined,
  }));

  const { sections } = await prompts({
    type: 'multiselect',
    name: 'sections',
    message: 'Select sections to install',
    choices,
    hint: '- Space to select, Enter to confirm',
  });

  return sections || [];
}

export async function addCommand(
  sectionArg?: string | string[], 
  options: AddOptions = {}
): Promise<void> {
  const cwd = options.cwd ?? process.cwd();

  // Check if initialized
  const config = await getConfig(cwd);
  
  if (!config) {
    logger.error('Project not initialized. Run "npx comp-cli init" first.');
    return;
  }

  const absoluteComponentsDir = path.join(cwd, config.componentsDir);

  // Determine which sections to install
  let sectionsToInstall: SectionName[];

  if (options.all) {
    // Install all sections
    sectionsToInstall = [...SECTION_NAMES];
  } else if (sectionArg) {
    // Install specified section(s)
    const sections = Array.isArray(sectionArg) ? sectionArg : [sectionArg];
    
    // Validate section names
    const invalidSections = sections.filter(s => !SECTION_NAMES.includes(s as SectionName));
    if (invalidSections.length > 0) {
      logger.error(`Invalid section(s): ${invalidSections.join(', ')}`);
      logger.info(`Available sections: ${SECTION_NAMES.join(', ')}`);
      return;
    }
    
    sectionsToInstall = sections as SectionName[];
  } else {
    // Interactive selection
    sectionsToInstall = await selectSections(config.installedSections);
    
    if (sectionsToInstall.length === 0) {
      logger.info('No sections selected.');
      return;
    }
  }

  logger.info(`\nInstalling sections: ${sectionsToInstall.join(', ')}\n`);

  // Install each section
  const installed: string[] = [];
  const skipped: string[] = [];

  for (const section of sectionsToInstall) {
    const spinner = createSpinner(`Installing ${section}...`);
    spinner.start();

    try {
      const success = await installSection(section, absoluteComponentsDir, options.overwrite ?? false);
      
      if (success) {
        spinner.succeed(`Installed ${section}`);
        installed.push(section);
      } else {
        spinner.info(`Skipped ${section}`);
        skipped.push(section);
      }
    } catch (error) {
      spinner.fail(`Failed to install ${section}`);
      logger.error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Update config with installed sections
  if (installed.length > 0) {
    await updateConfig(cwd, installed);
  }

  // Summary
  console.log('');
  if (installed.length > 0) {
    logger.success(`✨ Successfully installed: ${installed.join(', ')}`);
  }
  if (skipped.length > 0) {
    logger.info(`Skipped: ${skipped.join(', ')}`);
  }

  // Usage hint
  if (installed.length > 0) {
    console.log('');
    logger.info('Usage example:');
    logger.info('');
    const exampleSection = installed[0];
    const componentName = exampleSection.charAt(0).toUpperCase() + exampleSection.slice(1);
    logger.info(`  import { ${componentName} } from '@/components/sections/${exampleSection}';`);
    logger.info('');
    logger.info(`  <${componentName}`);
    logger.info(`    variant="centered"`);
    logger.info(`    theme="light"`);
    logger.info(`    content={{ heading: 'Hello', subheading: 'World' }}`);
    logger.info(`  />`);
    console.log('');
  }
}
