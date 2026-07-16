import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

export interface CutoverFinding {
  file: string;
  message: string;
}

const expectedScripts = {
  'build': 'tsdown && npm run build:packages',
  'dev': 'lobedocs dev',
  'docs:build': 'lobedocs build',
  'docs:build-analyze': 'cross-env ANALYZE=1 lobedocs build',
  'docs:dev': 'lobedocs dev',
  'setup': 'lobedocs typegen',
  'start': 'bun run docs:dev',
  'type-check': 'lobedocs typegen && tsc --noEmit && tsc --noEmit -p tsconfig.site.json',
} as const;

const expectedVercelConfig = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: null,
  installCommand: 'bun install',
  buildCommand: 'bun run docs:build',
  devCommand: 'bun run docs:dev',
  ignoreCommand:
    'git diff HEAD^ HEAD --quiet -- ./package.json ./src ./docs ./packages ./public ./vercel.json ./docs.config.ts ./compatibility.json ./navigationSections.json ./tsconfig.site.json ./tsconfig.json',
  outputDirectory: 'dist',
  trailingSlash: false,
};

const executableDumiPattern =
  /(?:(?:from\s+|import\s+|import\s*\(\s*|require\s*\(\s*)['"]dumi(?:\/[^'"]*)?['"]|\bdumi\s+(?:build|dev|setup)\b|dumi-theme-lobehub|babel-plugin-dumi-preflight|\.dumirc(?:\.ts)?|\.dumi(?:\/|\b)|\.umi(?:-production|-test)?(?:\/|\b)|@umijs\/)/i;

const normalizePath = (value: string): string => value.replaceAll('\\', '/');

const pushFinding = (findings: CutoverFinding[], file: string, message: string): void => {
  findings.push({ file: normalizePath(file), message });
};

const readText = (root: string, file: string): string | undefined => {
  const absolutePath = path.resolve(root, file);
  return existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : undefined;
};

const readJson = (
  root: string,
  file: string,
  findings: CutoverFinding[],
): Record<string, unknown> | undefined => {
  const source = readText(root, file);
  if (source === undefined) {
    pushFinding(findings, file, 'Required cutover file is missing.');
    return undefined;
  }

  try {
    return JSON.parse(source) as Record<string, unknown>;
  } catch (error) {
    pushFinding(
      findings,
      file,
      `Cutover configuration is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
    return undefined;
  }
};

const auditPackage = (root: string, findings: CutoverFinding[]): void => {
  const packageJson = readJson(root, 'package.json', findings);
  if (!packageJson) return;

  const scripts = (packageJson.scripts ?? {}) as Record<string, unknown>;
  for (const [name, expected] of Object.entries(expectedScripts)) {
    if (scripts[name] !== expected) {
      pushFinding(
        findings,
        'package.json',
        `Script "${name}" must be "${expected}" after documentation cutover.`,
      );
    }
  }

  for (const [name, command] of Object.entries(scripts)) {
    if (name.startsWith('site:')) {
      pushFinding(findings, 'package.json', `Temporary documentation script "${name}" remains.`);
    }
    if (typeof command === 'string' && executableDumiPattern.test(command)) {
      pushFinding(findings, 'package.json', `Script "${name}" still invokes the legacy stack.`);
    }
  }

  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies'] as const) {
    const dependencies = (packageJson[group] ?? {}) as Record<string, unknown>;
    for (const name of [
      'babel-plugin-antd-style',
      'babel-plugin-dumi-preflight',
      'dumi',
      'dumi-theme-lobehub',
    ]) {
      if (name in dependencies) {
        pushFinding(
          findings,
          'package.json',
          `${group} still contains documentation-only package "${name}".`,
        );
      }
    }
  }
};

const auditTextResidue = (root: string, findings: CutoverFinding[]): void => {
  const executableFiles = [
    'tsconfig.json',
    'eslint.config.mjs',
    '.gitignore',
    '.prettierignore',
    '.npmrc',
    '.github/workflows/test.yml',
  ];

  for (const file of executableFiles) {
    const source = readText(root, file);
    if (source !== undefined && executableDumiPattern.test(source)) {
      pushFinding(findings, file, 'Executable legacy framework residue remains.');
    }
  }

  for (const file of ['.dumirc.ts', '.umirc.ts']) {
    if (existsSync(path.resolve(root, file))) {
      pushFinding(findings, file, 'Executable legacy framework configuration remains.');
    }
  }

  for (const directory of ['.dumi', '.umi', '.umi-production', '.umi-test']) {
    if (existsSync(path.resolve(root, directory))) {
      pushFinding(findings, directory, 'Generated legacy framework directory remains.');
    }
  }

  const demoCopyFile = 'src/awesome/SpotlightCard/demos/data.ts';
  const demoCopy = readText(root, demoCopyFile);
  if (demoCopy && /\bdumi(?:2|-theme|-theme-lobehub)?\b/i.test(demoCopy)) {
    pushFinding(
      findings,
      demoCopyFile,
      'Visible demo copy still claims legacy framework ownership.',
    );
  }

  const localTestingFile = '.agents/skills/local-testing/SKILL.md';
  const localTesting = readText(root, localTestingFile);
  if (localTesting === undefined) {
    pushFinding(findings, localTestingFile, 'Local testing instructions are missing.');
  } else {
    if (/\bdumi\b/i.test(localTesting)) {
      pushFinding(findings, localTestingFile, 'Local testing still assumes the legacy server.');
    }
    for (const marker of [
      'bun run docs:dev',
      'compatibility.json',
      '.documents[] | select(.source == $source) | .pathname',
      '[aria-current="page"]',
      '[data-standalone-demo]',
    ]) {
      if (!localTesting.includes(marker)) {
        pushFinding(
          findings,
          localTestingFile,
          `Local testing instructions must document ${marker}.`,
        );
      }
    }
    if (!/http:\/\/localhost:\[0-9\]\+/.test(localTesting)) {
      pushFinding(
        findings,
        localTestingFile,
        'Local testing instructions must discover the dynamic Vite port from its log.',
      );
    }
  }
};

const auditRepositoryExecutableResidue = (root: string, findings: CutoverFinding[]): void => {
  const excludedDirectories = new Set([
    '.dumi',
    '.git',
    '.react-router',
    '.superpowers',
    '.umi',
    '.umi-production',
    '.umi-test',
    'coverage',
    'dist',
    'es',
    'lib',
    'node_modules',
  ]);
  const excludedPrefixes = ['changelog/', 'docs/superpowers/'];
  const excludedFiles = new Set([
    'CHANGELOG.md',
    'docs/changelog.mdx',
    'packages/docs-kit/site/compiler/cutoverAudit.test.ts',
    'packages/docs-kit/site/compiler/cutoverAudit.ts',
  ]);
  const executableExtensions = new Set([
    '.cjs',
    '.js',
    '.json',
    '.jsx',
    '.mjs',
    '.mdx',
    '.toml',
    '.ts',
    '.tsx',
    '.yaml',
    '.yml',
  ]);

  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
      const absolutePath = path.resolve(directory, entry.name);
      const relativePath = normalizePath(path.relative(root, absolutePath));
      if (excludedPrefixes.some((prefix) => relativePath.startsWith(prefix))) continue;
      if (entry.isDirectory()) {
        visit(absolutePath);
        continue;
      }
      if (!entry.isFile() || excludedFiles.has(relativePath)) continue;
      if (!executableExtensions.has(path.extname(entry.name))) continue;

      const source = readFileSync(absolutePath, 'utf8');
      const match = executableDumiPattern.exec(source);
      if (!match) continue;
      const line = source.slice(0, match.index).split('\n').length;
      pushFinding(
        findings,
        relativePath,
        `Executable legacy framework reference remains at line ${line}.`,
      );
    }
  };

  visit(root);
};

const auditWorkspaceBuildAllowlist = (root: string, findings: CutoverFinding[]): void => {
  const file = 'pnpm-workspace.yaml';
  const source = readText(root, file);
  if (source === undefined) {
    pushFinding(findings, file, 'Workspace build allowlist is missing.');
    return;
  }

  for (const dependency of ['@swc/core', 'core-js', 'core-js-pure']) {
    if (new RegExp(`^[ \\t]*['"]?${dependency}['"]?:`, 'm').test(source)) {
      pushFinding(findings, file, `Legacy compiler allow-build entry "${dependency}" remains.`);
    }
  }

  for (const dependency of ['@parcel/watcher', 'esbuild', 'unrs-resolver']) {
    if (!new RegExp(`^[ \\t]*['"]?${dependency}['"]?:[ \\t]*true`, 'm').test(source)) {
      pushFinding(findings, file, `Required allow-build entry "${dependency}" is missing.`);
    }
  }
};

const auditCi = (root: string, findings: CutoverFinding[]): void => {
  const file = '.github/workflows/test.yml';
  const source = readText(root, file);
  if (source === undefined) {
    pushFinding(findings, file, 'Test workflow is missing.');
    return;
  }

  for (const command of [
    'bunx vitest run packages/docs-kit/site scripts/migrate-dumi-docs.test.ts',
    'bunx tsx scripts/migrate-dumi-docs.ts --check',
    'bun run docs:build',
  ]) {
    if (!source.includes(command)) {
      pushFinding(findings, file, `Documentation verification command "${command}" is missing.`);
    }
  }
};

const auditVercelConfig = (root: string, findings: CutoverFinding[]): void => {
  const file = 'vercel.json';
  const config = readJson(root, file, findings);
  if (!config) return;

  if (!isDeepStrictEqual(config, expectedVercelConfig)) {
    pushFinding(
      findings,
      file,
      'Vercel must deploy the finalized static artifact without framework routing or rewrites.',
    );
  }
};

export function findExecutableDumiReferences(repositoryRoot: string): CutoverFinding[] {
  const root = path.resolve(repositoryRoot);
  const findings: CutoverFinding[] = [];

  auditPackage(root, findings);
  auditTextResidue(root, findings);
  auditRepositoryExecutableResidue(root, findings);
  auditWorkspaceBuildAllowlist(root, findings);
  auditCi(root, findings);
  auditVercelConfig(root, findings);

  return findings.toSorted(
    (left, right) =>
      left.file.localeCompare(right.file, 'en') || left.message.localeCompare(right.message, 'en'),
  );
}
