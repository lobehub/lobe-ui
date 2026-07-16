import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import compatibility from '../../../../compatibility.json';
import { findExecutableDumiReferences } from './cutoverAudit';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';
import { getPrerenderPaths } from './manifests';
import type { DocumentationInventory } from './types';

const repositoryRoot = path.resolve(import.meta.dirname, '../../../..');

const write = (root: string, file: string, source: string): void => {
  const absolutePath = path.resolve(root, file);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, source);
};

const validScripts = {
  'build': 'tsdown && npm run build:packages',
  'dev': 'lobedocs dev',
  'docs:build': 'lobedocs build',
  'docs:build-analyze': 'cross-env ANALYZE=1 lobedocs build',
  'docs:dev': 'lobedocs dev',
  'setup': 'lobedocs typegen',
  'start': 'bun run docs:dev',
  'type-check': 'lobedocs typegen && tsc --noEmit && tsc --noEmit -p tsconfig.site.json',
};

const createValidFixture = (): string => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-cutover-'));
  write(
    root,
    'package.json',
    JSON.stringify({ dependencies: {}, devDependencies: {}, scripts: validScripts }),
  );
  write(root, 'tsconfig.json', JSON.stringify({ compilerOptions: { paths: {} } }));
  write(root, 'eslint.config.mjs', 'export default [];');
  write(root, '.gitignore', '.react-router/\ndist\n');
  write(root, '.prettierignore', '.react-router/\ndist\n');
  write(root, '.npmrc', 'lockfile=false\n');
  write(
    root,
    'pnpm-workspace.yaml',
    "allowBuilds:\n  '@parcel/watcher': true\n  esbuild: true\n  unrs-resolver: true\n",
  );
  write(
    root,
    '.github/workflows/test.yml',
    'run: |\n  bunx vitest run packages/docs-kit/site scripts/migrate-dumi-docs.test.ts\n  bunx tsx scripts/migrate-dumi-docs.ts --check\n  bun run docs:build\n',
  );
  write(
    root,
    '.agents/skills/local-testing/SKILL.md',
    'Start `bun run docs:dev`; discover `http://localhost:[0-9]+` from the log. Read `compatibility.json` as the path authority with `.documents[] | select(.source == $source) | .pathname`. Use `[aria-current="page"]` and `[data-standalone-demo]`.\n',
  );
  write(
    root,
    'src/awesome/SpotlightCard/demos/data.ts',
    "export default [{ content: 'React Router documentation', title: 'Lobe UI' }];\n",
  );
  write(
    root,
    'vercel.json',
    JSON.stringify({
      $schema: 'https://openapi.vercel.sh/vercel.json',
      buildCommand: 'bun run docs:build',
      devCommand: 'bun run docs:dev',
      framework: null,
      ignoreCommand:
        'git diff HEAD^ HEAD --quiet -- ./package.json ./src ./docs ./packages ./public ./vercel.json ./docs.config.ts ./compatibility.json ./navigationSections.json ./tsconfig.site.json ./tsconfig.json',
      installCommand: 'bun install',
      outputDirectory: 'dist',
      trailingSlash: false,
    }),
  );
  return root;
};

it('distinguishes executable legacy coupling from compatibility vocabulary and history', () => {
  const root = createValidFixture();
  try {
    write(root, 'docs/changelog.mdx', 'The documentation previously used dumi.\n');
    write(
      root,
      'packages/docs-kit/site/compiler/legacyDumiIds.ts',
      "export const legacyDumiIds = ['docs-demo-docs'];\n",
    );
    expect(findExecutableDumiReferences(root)).toEqual([]);

    write(root, '.gitignore', '.umi\n');
    expect(findExecutableDumiReferences(root).some(({ file }) => file === '.gitignore')).toBe(true);
    write(root, '.gitignore', '.react-router/\ndist\n');

    write(root, '.dumi/tmp/generated.ts', 'export {};\n');
    expect(findExecutableDumiReferences(root).some(({ file }) => file === '.dumi')).toBe(true);
    rmSync(path.resolve(root, '.dumi'), { force: true, recursive: true });

    write(root, 'scripts/rogue-docs.ts', "import { defineConfig } from 'dumi';\n");
    expect(
      findExecutableDumiReferences(root).some(({ file }) => file === 'scripts/rogue-docs.ts'),
    ).toBe(true);
    rmSync(path.resolve(root, 'scripts/rogue-docs.ts'));

    write(root, 'scripts/side-effect-docs.ts', "import 'dumi';\n");
    expect(
      findExecutableDumiReferences(root).some(({ file }) => file === 'scripts/side-effect-docs.ts'),
    ).toBe(true);
    rmSync(path.resolve(root, 'scripts/side-effect-docs.ts'));

    write(root, '.dumirc.ts', "import { defineConfig } from 'dumi';\n");
    const packageJson = JSON.parse(readFileSync(path.resolve(root, 'package.json'), 'utf8'));
    packageJson.scripts.dev = 'dumi dev';
    packageJson.devDependencies.dumi = '2.4.30';
    write(root, 'package.json', JSON.stringify(packageJson));
    write(root, '.github/workflows/test.yml', 'run: dumi build\n');
    write(root, '.agents/skills/local-testing/SKILL.md', 'Start the dumi server on port 8000.\n');
    write(
      root,
      'src/awesome/SpotlightCard/demos/data.ts',
      "export default [{ content: 'dumi-theme-lobehub documentation' }];\n",
    );

    const findings = findExecutableDumiReferences(root);
    expect(findings.some(({ file }) => file === '.dumirc.ts')).toBe(true);
    expect(findings.some(({ file }) => file === 'package.json')).toBe(true);
    expect(findings.some(({ file }) => file === '.github/workflows/test.yml')).toBe(true);
    expect(findings.some(({ file }) => file === '.agents/skills/local-testing/SKILL.md')).toBe(
      true,
    );
    expect(findings.some(({ file }) => file === 'src/awesome/SpotlightCard/demos/data.ts')).toBe(
      true,
    );
    expect(findings.some(({ file }) => file.includes('changelog'))).toBe(false);
    expect(findings.some(({ file }) => file.includes('legacyDumiIds'))).toBe(false);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('contains no executable legacy documentation-framework coupling', () => {
  expect(findExecutableDumiReferences(repositoryRoot)).toEqual([]);
});

it('preserves the homepage demo source and every frozen standalone path', () => {
  const inventory = compatibility as DocumentationInventory;
  const homepageDemo = inventory.demoReferences.find(
    ({ legacyId, source }) => legacyId === 'docs-demo-docs' && source === 'docs/index.tsx',
  );

  expect(homepageDemo).toBeDefined();
  expect(readFileSync(path.resolve(repositoryRoot, 'docs/index.tsx'), 'utf8')).toContain(
    'Start building your AIGC app now',
  );
  expect(getStandaloneDemoPaths(inventory)).toHaveLength(992);
  expect(getStandaloneDemoPaths(inventory)).toContain('/~demos/docs-demo-docs');
  const prerenderPaths = getPrerenderPaths();
  expect(prerenderPaths.filter((pathname) => pathname.startsWith('/~demos/'))).toHaveLength(992);
  expect(
    prerenderPaths.filter(
      (pathname) =>
        pathname !== '/404' &&
        pathname !== '/antd.css' &&
        pathname !== '/theme-vars.css' &&
        !pathname.startsWith('/~demos/'),
    ),
  ).toHaveLength(160);
});

it('documents compatibility-backed canonical documentation path discovery', () => {
  const instructions = readFileSync(
    path.resolve(repositoryRoot, '.agents/skills/local-testing/SKILL.md'),
    'utf8',
  );

  expect(instructions).toContain('.documents[] | select(.source == $source) | .pathname');
  expect(instructions).toContain('path authority');
  expect(instructions).toContain(`agent-browser click 'button[aria-label="Search documentation"]'`);
  expect(instructions).toMatch(/mobile[^\n]*Open search/i);
  expect(instructions).not.toMatch(/Open search[^\n]*navigation (?:dialog|sheet)/i);
});
