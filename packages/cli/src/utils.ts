/**
 * CLI Utilities
 */

import chalk from 'chalk';
import ora, { Ora } from 'ora';
import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig, ProjectFramework, RouterType, PackageManager } from './types';

// ============================================================================
// Logger
// ============================================================================

export const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  
  // Styled messages
  title: (msg: string) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
  subtitle: (msg: string) => console.log(chalk.dim(msg)),
  highlight: (msg: string) => chalk.cyan(msg),
  dim: (msg: string) => chalk.dim(msg),
  
  // Blank line
  newline: () => console.log(),
  
  // Box style output
  box: (title: string, content: string[]) => {
    console.log();
    console.log(chalk.cyan('┌─'), chalk.bold(title));
    content.forEach(line => {
      console.log(chalk.cyan('│'), line);
    });
    console.log(chalk.cyan('└─'));
    console.log();
  },
};

// ============================================================================
// Spinner
// ============================================================================

export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
  });
}

// ============================================================================
// Project Detection
// ============================================================================

export async function detectProject(cwd: string): Promise<ProjectConfig> {
  const rootPath = path.resolve(cwd);
  
  // Check for package.json
  const packageJsonPath = path.join(rootPath, 'package.json');
  let packageJson: Record<string, unknown> = {};
  
  if (await fs.pathExists(packageJsonPath)) {
    packageJson = await fs.readJson(packageJsonPath);
  }

  const dependencies = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {}),
  };

  // Detect framework
  const framework = detectFramework(dependencies);
  
  // Detect TypeScript
  const typescript = await detectTypeScript(rootPath, dependencies);
  
  // Detect router type (Next.js)
  const routerType = await detectRouterType(rootPath, framework);
  
  // Detect package manager
  const packageManager = await detectPackageManager(rootPath);
  
  // Detect source directory
  const srcDir = await detectSrcDir(rootPath);
  
  // Detect tailwind
  const hasTailwind = 'tailwindcss' in dependencies;
  
  // Determine components directory
  const componentsDir = path.join(srcDir, 'components', 'sections');

  return {
    framework,
    typescript,
    routerType,
    packageManager,
    rootPath,
    srcDir,
    componentsDir,
    hasTailwind,
  };
}

function detectFramework(dependencies: Record<string, string>): ProjectFramework {
  if ('next' in dependencies) {
    return 'nextjs';
  }
  if ('react' in dependencies) {
    return 'react';
  }
  return 'unknown';
}

async function detectTypeScript(rootPath: string, dependencies: Record<string, string>): Promise<boolean> {
  // Check for tsconfig.json
  const tsconfigPath = path.join(rootPath, 'tsconfig.json');
  if (await fs.pathExists(tsconfigPath)) {
    return true;
  }
  
  // Check for typescript dependency
  if ('typescript' in dependencies) {
    return true;
  }
  
  return false;
}

async function detectRouterType(rootPath: string, framework: ProjectFramework): Promise<RouterType> {
  if (framework !== 'nextjs') {
    return 'unknown';
  }

  // Check for app directory (App Router)
  const appDirPaths = [
    path.join(rootPath, 'app'),
    path.join(rootPath, 'src', 'app'),
  ];

  for (const appDir of appDirPaths) {
    if (await fs.pathExists(appDir)) {
      // Check for layout.tsx/js file (definitive App Router indicator)
      const layoutTsx = path.join(appDir, 'layout.tsx');
      const layoutJs = path.join(appDir, 'layout.js');
      if (await fs.pathExists(layoutTsx) || await fs.pathExists(layoutJs)) {
        return 'app';
      }
    }
  }

  // Check for pages directory (Pages Router)
  const pagesDirPaths = [
    path.join(rootPath, 'pages'),
    path.join(rootPath, 'src', 'pages'),
  ];

  for (const pagesDir of pagesDirPaths) {
    if (await fs.pathExists(pagesDir)) {
      return 'pages';
    }
  }

  return 'unknown';
}

async function detectPackageManager(rootPath: string): Promise<PackageManager> {
  // Check for lock files
  if (await fs.pathExists(path.join(rootPath, 'bun.lockb'))) {
    return 'bun';
  }
  if (await fs.pathExists(path.join(rootPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await fs.pathExists(path.join(rootPath, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

async function detectSrcDir(rootPath: string): Promise<string> {
  const srcPath = path.join(rootPath, 'src');
  if (await fs.pathExists(srcPath)) {
    return srcPath;
  }
  return rootPath;
}

// ============================================================================
// File Operations
// ============================================================================

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest);
}

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function readJsonFile<T = Record<string, unknown>>(filePath: string): Promise<T> {
  return fs.readJson(filePath);
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.writeJson(filePath, data, { spaces: 2 });
}

// ============================================================================
// Package Manager Commands
// ============================================================================

export function getInstallCommand(packageManager: PackageManager, packages: string[]): string {
  if (packages.length === 0) return '';
  
  const packagesStr = packages.join(' ');
  
  switch (packageManager) {
    case 'yarn':
      return `yarn add ${packagesStr}`;
    case 'pnpm':
      return `pnpm add ${packagesStr}`;
    case 'bun':
      return `bun add ${packagesStr}`;
    default:
      return `npm install ${packagesStr}`;
  }
}

// ============================================================================
// Path Utilities
// ============================================================================

export function getRelativePath(from: string, to: string): string {
  return path.relative(from, to).replace(/\\/g, '/');
}

export function normalizePath(p: string): string {
  return p.replace(/\\/g, '/');
}
