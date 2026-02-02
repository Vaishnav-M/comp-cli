#!/usr/bin/env node

/**
 * comp-cli - Section-based UI Component Registry CLI
 * 
 * A CLI tool for installing reusable section components into your project.
 */

import { Command } from 'commander';
import { initCommand } from '../commands/init';
import { addCommand } from '../commands/add';

const packageJson = require('../../package.json');

const program = new Command();

program
  .name('comp-cli')
  .description('Section-based UI Component Registry CLI')
  .version(packageJson.version);

// Init command
program
  .command('init')
  .description('Initialize component registry in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--cwd <path>', 'Working directory (defaults to current directory)')
  .action(async (options) => {
    try {
      await initCommand({
        cwd: options.cwd,
        yes: options.yes,
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Add command
program
  .command('add [sections...]')
  .description('Add section components to your project')
  .option('-a, --all', 'Install all available sections')
  .option('-o, --overwrite', 'Overwrite existing sections without prompting')
  .option('--cwd <path>', 'Working directory (defaults to current directory)')
  .action(async (sections, options) => {
    try {
      await addCommand(
        sections.length > 0 ? sections : undefined,
        {
          cwd: options.cwd,
          all: options.all,
          overwrite: options.overwrite,
        }
      );
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// List command - shows available sections
program
  .command('list')
  .alias('ls')
  .description('List available sections')
  .action(() => {
    console.log('\nAvailable sections:\n');
    const sections = [
      { name: 'hero', variants: 'centered, split, fullwidth' },
      { name: 'about', variants: 'text-heavy, image-focused, values' },
      { name: 'contact', variants: 'simple, with-info, cta-based' },
      { name: 'booking', variants: 'minimal, datetime, with-info' },
      { name: 'footer', variants: 'minimal, multi-column, newsletter' },
    ];

    for (const section of sections) {
      console.log(`  ${section.name}`);
      console.log(`    Variants: ${section.variants}\n`);
    }

    console.log('Install a section with: npx comp-cli add <section>');
    console.log('Install all sections with: npx comp-cli add --all\n');
  });

program.parse();
