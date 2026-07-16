// @vitest-environment node

import {
  cpSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { migrateDumiDocs, MigrationBlockedError } from './migrate-dumi-docs';

const { join, relative, resolve } = path;

const fixtures = resolve(import.meta.dirname, '__fixtures__/migrate-dumi-docs');
const temporaryRoots: string[] = [];

const copyFixture = (name: string): string => {
  const root = mkdtempSync(join(tmpdir(), `lobe-ui-migrate-${name}-`));
  temporaryRoots.push(root);
  cpSync(resolve(fixtures, name), root, { recursive: true });
  return root;
};

const collectContents = (root: string, directory = root): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) Object.assign(result, collectContents(root, path));
    else result[relative(root, path).replaceAll('\\', '/')] = readFileSync(path, 'utf8');
  }
  return result;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('deterministic dumi demo migration', () => {
  it('converts all option variants in first-reference order and protects literal examples', async () => {
    const root = copyFixture('complete');

    await migrateDumiDocs({ check: false, root, write: true });

    const output = readFileSync(resolve(root, 'src/Options/index.mdx'), 'utf8');
    const imports = output.match(/^import Demo\w+ from '.+\?demo';$/gm) ?? [];
    expect(imports).toEqual([
      "import DemoBasic2 from './demos/basic.tsx?demo';",
      "import DemoWindows from './demos/windows.tsx?demo';",
      "import DemoBareLower from './demos/bare-lower.tsx?demo';",
      "import DemoBareCamel from './demos/bare-camel.tsx?demo';",
      "import DemoIsolated from './demos/isolated.tsx?demo';",
      "import DemoIsolatedBare from './demos/isolated-bare.tsx?demo';",
      "import DemoInline from './demos/inline.tsx?demo';",
    ]);
    expect(output).toContain("export const DemoBasic = 'author binding';");
    expect(output.match(/import DemoBasic2 /g)).toHaveLength(1);
    expect(output.match(/<Demo of=\{DemoBasic2\} \/>/g)).toHaveLength(2);
    expect(output).toContain('<Demo of={DemoWindows} layout="center" />');
    expect(output).toContain('<Demo of={DemoBareLower} layout="bare" />');
    expect(output).toContain('<Demo of={DemoBareCamel} layout="bare" />');
    expect(output).toContain('<Demo of={DemoIsolated} isolated />');
    expect(output).toContain('<Demo of={DemoIsolatedBare} isolated layout="bare" />');
    expect(output).toContain('<Demo of={DemoInline} />');
    expect(output).toContain('```md\n<code src="./demos/fenced.tsx"></code>\n```');
    expect(output).toContain('`<code src="./demos/inline-literal.tsx"></code>`');
    expect(output).toContain('\\<code src="./demos/escaped.tsx"></code>');
    expect(output).toContain('<div><code src="./demos/html-example.tsx"></code></div>');
    expect(output).toContain('[https://example.test](https://example.test)');
  });

  it('reports the three inventory equations without calling standalone-only demos rewrites', async () => {
    const report = await migrateDumiDocs({ check: true, root: copyFixture('complete') });

    expect(report).toMatchObject({
      acknowledgedStandaloneOnly: 1,
      apiSections: 4,
      apiSourceOverrides: 1,
      deliberateApiOmissions: 1,
      isolatedDemos: 2,
      legacyDemoTags: 8,
      legacyDocuments: 5,
      migratedDemoUses: 1,
      migratedDocuments: 2,
    });
    expect(report.legacyDocuments + report.migratedDocuments).toBe(7);
    expect(
      report.legacyDemoTags + report.migratedDemoUses + report.acknowledgedStandaloneOnly,
    ).toBe(10);
    expect(report.apiSections + report.deliberateApiOmissions).toBe(5);
    expect(report.unknownAttributes).toEqual([]);
    expect(report.unresolvedSources).toEqual([]);
  });

  it('preserves API prose by disposition, records stable SHAs, and migrates frontmatter metadata', async () => {
    const root = copyFixture('complete');
    const optionsBefore = readFileSync(resolve(root, 'src/Options/index.md'), 'utf8');
    const comparisonTable = optionsBefore.match(
      /\| Feature[^\n]*\n\| [-| ]+\n\| Rendering[^\n]*/,
    )?.[0];
    const preservedBefore = readFileSync(resolve(root, 'src/Preserve/index.md'), 'utf8');
    const buttonBefore = readFileSync(resolve(root, 'src/Button/index.mdx'), 'utf8');

    const report = await migrateDumiDocs({ check: false, root, write: true });

    const options = readFileSync(resolve(root, 'src/Options/index.mdx'), 'utf8');
    const preserved = readFileSync(resolve(root, 'src/Preserve/index.mdx'), 'utf8');
    const replaced = readFileSync(resolve(root, 'src/Replace/index.mdx'), 'utf8');
    expect(options).toContain('category: General');
    expect(options).not.toMatch(/^(nav|group|apiHeader|atomId|subType):/m);
    expect(options).toContain('Manual API guidance must survive.');
    expect(options).toContain('const preservedAroundTable = true;');
    expect(options).toContain('<Api name="Options" from="./options" migrationKey=');
    expect(options).toContain('<Api name="OptionsItem" migrationKey=');
    expect(options).not.toContain('| value    | Fixture value | `string` |');
    expect(options).not.toContain('| active   | Active state | `boolean` | `false` |');
    expect(options).toContain('This nested data shape is not a callable component API');
    expect(options).toContain('| label    | Display label | `string` |');
    expect(comparisonTable).toBeTruthy();
    expect(options).toContain(comparisonTable);
    expect(options).toMatch(
      /Secondary API guidance\.[\s\S]*<Api name="OptionsItem" migrationKey="[^"]+" \/>/,
    );
    expect(preserved).toContain('This entire legacy API body stays unchanged.');
    expect(preservedBefore.split('## APIs')[1]).toBe(preserved.split('## APIs')[1]);
    expect(replaced).toContain('<Api name="Replace" from="./public" />');
    expect(replaced.endsWith('<Api name="Replace" from="./public" />\n')).toBe(true);
    expect(replaced).not.toContain('Reviewed content to replace.');
    expect(readFileSync(resolve(root, 'src/Button/index.mdx'), 'utf8')).toBe(buttonBefore);
    expect(readFileSync(resolve(root, 'docs/changelog.mdx'), 'utf8')).toContain(
      "import Changelog from '../CHANGELOG.md';\n\n<Changelog />",
    );
    expect(report.metadata.find(({ source }) => source === 'src/Options/index.md')).toMatchObject({
      apiHeader: expect.any(Object),
      atomId: 'Options',
      category: 'General',
      categoryOrder: 2,
      subType: 'Tool',
    });
    expect(report.apiBodyDispositions.records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          disposition: 'replace-tables',
          document: 'src/Options/index.md',
          preservedSha: expect.stringMatching(/^[a-f\d]{64}$/),
        }),
        expect.objectContaining({
          disposition: 'preserve-all',
          document: 'src/Preserve/index.md',
          reason: 'The prose and compatibility table are intentionally retained.',
        }),
        expect.objectContaining({
          disposition: 'replace-all',
          document: 'src/Replace/index.md',
          reason: 'The reviewed generated contract supersedes this section.',
        }),
      ]),
    );

    const complete = await migrateDumiDocs({ check: true, root });
    expect(complete.apiBodyDispositions.missing).toEqual([]);
    expect(readFileSync(resolve(root, 'src/Options/index.mdx'), 'utf8')).toContain(
      '| label    | Display label | `string` |',
    );
  });

  it('keeps check mode byte- and mtime-stable and makes two writes byte-idempotent', async () => {
    const root = copyFixture('complete');
    const path = resolve(root, 'src/Options/index.md');
    const before = readFileSync(path, 'utf8');
    const mtime = statSync(path).mtimeMs;

    await migrateDumiDocs({ check: true, root });
    expect(readFileSync(path, 'utf8')).toBe(before);
    expect(statSync(path).mtimeMs).toBe(mtime);

    await migrateDumiDocs({ check: false, root, write: true });
    const first = collectContents(root);
    await migrateDumiDocs({ check: false, root, write: true });
    expect(collectContents(root)).toEqual(first);
  });

  it('keeps reviewed metadata and current manual API content accurate across migration phases', async () => {
    const root = copyFixture('complete');

    const discovery = await migrateDumiDocs({ check: true, root });
    expect(discovery).toMatchObject({
      apiSourceOverrides: 1,
      missingDescriptions: [],
      phase: 'discovery',
    });
    expect(discovery.apiBodyDispositions.manualSections).toBe(4);

    await migrateDumiDocs({ check: false, root, write: true });
    const complete = await migrateDumiDocs({ check: true, root });

    expect(complete).toMatchObject({
      apiSourceOverrides: 1,
      invariantDiagnostics: [],
      missingDescriptions: [],
      phase: 'post-migration',
      wouldChange: [],
    });
    expect(complete.apiBodyDispositions.manualSections).toBe(3);
    expect(
      complete.metadata.find(({ source }) => source === 'src/Options/index.mdx'),
    ).toMatchObject({
      atomId: 'Options',
      apiHeader: {
        docUrl: 'https://example.test/options',
        pkg: '@fixture/options',
        sourceUrl: 'https://example.test/source',
      },
      category: 'General',
      categoryOrder: 2,
      hero: {
        description: 'Reviewed fixture hero.',
        title: 'Options fixture',
      },
      nav: 'Components',
      subType: 'Tool',
    });
  });

  it.each([
    ['name', 'name="Options"', 'name="Wrong"'],
    ['from', 'from="./options"', 'from="./wrong"'],
  ])(
    'rejects drift in generated API target %s during post-migration checks',
    async (_, from, to) => {
      const root = copyFixture('complete');
      await migrateDumiDocs({ check: false, root, write: true });
      const path = resolve(root, 'src/Options/index.mdx');
      writeFileSync(path, readFileSync(path, 'utf8').replace(from, to));

      const report = await migrateDumiDocs({ check: true, root });

      expect(report.apiBodyDispositions.missing).toContain('src/Options/index.mdx');
    },
  );

  it('requires deep-equivalent reviewed config before removing migration-only metadata', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const options = config.documents['src/Options/index.md'];
    for (const key of ['apiHeader', 'atomId', 'categoryOrder', 'nav', 'subType']) {
      delete options[key];
    }
    options.hero.description = 'Changed reviewed hero.';
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });

    expect(report.unpersistedMetadata.map(({ message }) => message)).toEqual(
      expect.arrayContaining(
        ['apiHeader', 'atomId', 'categoryOrder', 'hero', 'nav', 'subType'].map((key) =>
          expect.stringContaining(key),
        ),
      ),
    );
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
  });

  it('accepts an explicit reviewed apiHeader link correction while still requiring persistence', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const options = config.documents['src/Options/index.md'];
    options.apiHeader = {
      ...options.apiHeader,
      docUrl: 'https://example.test/options/index.mdx',
      sourceUrl: 'https://example.test/options/source.tsx',
    };
    options.reviewedApiHeaderOverride = true;
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.unpersistedMetadata.map(({ message }) => message)).not.toEqual(
      expect.arrayContaining([expect.stringContaining('apiHeader')]),
    );

    delete options.apiHeader;
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
    const missing = await migrateDumiDocs({ check: true, root });
    expect(missing.unpersistedMetadata.map(({ message }) => message)).toEqual(
      expect.arrayContaining([expect.stringContaining('apiHeader')]),
    );
  });

  it('enforces the configured frozen inventory when a manifest entry disappears', async () => {
    const root = copyFixture('complete');
    const compatibilityPath = resolve(root, 'packages/docs-kit/site/content/compatibility.json');
    const compatibility = JSON.parse(readFileSync(compatibilityPath, 'utf8'));
    compatibility.documents = compatibility.documents.filter(
      ({ source }: { source: string }) => source !== 'src/Replace/index.md',
    );
    writeFileSync(compatibilityPath, `${JSON.stringify(compatibility, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });

    expect(report.invariantDiagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('frozen public documents') }),
        expect.objectContaining({ message: expect.stringContaining('component API decisions') }),
      ]),
    );
  });

  it('rejects an unowned MDX destination instead of overwriting it', async () => {
    const root = copyFixture('complete');
    const legacyPath = resolve(root, 'src/Options/index.md');
    const destinationPath = resolve(root, 'src/Options/index.mdx');
    const legacyBefore = readFileSync(legacyPath, 'utf8');
    const destinationBefore = 'unowned destination\n';
    writeFileSync(destinationPath, destinationBefore);

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.destinationConflicts).toEqual([
      expect.objectContaining({
        document: 'src/Options/index.md',
        message: expect.stringContaining('already exists'),
      }),
    ]);
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
    expect(readFileSync(legacyPath, 'utf8')).toBe(legacyBefore);
    expect(readFileSync(destinationPath, 'utf8')).toBe(destinationBefore);
  });

  it('rolls back prepared outputs when promotion fails before legacy removal', async () => {
    const root = copyFixture('complete');
    const before = collectContents(root);

    await expect(
      migrateDumiDocs({
        check: false,
        fileOperations: {
          writeFile(path, contents) {
            if (path.endsWith('packages/docs-kit/site/content/compatibility.json')) {
              throw new Error('injected promotion failure');
            }
            writeFileSync(path, contents);
          },
        },
        root,
        write: true,
      }),
    ).rejects.toThrow('injected promotion failure');

    expect(collectContents(root)).toEqual(before);
  });

  it('preserves a document CRLF convention deterministically', async () => {
    const root = copyFixture('complete');
    const sourcePath = resolve(root, 'src/Options/index.md');
    writeFileSync(sourcePath, readFileSync(sourcePath, 'utf8').replaceAll('\n', '\r\n'));

    await migrateDumiDocs({ check: false, root, write: true });
    const output = readFileSync(resolve(root, 'src/Options/index.mdx'), 'utf8');

    expect(output).toContain('\r\n');
    expect(output).not.toMatch(/(?<!\r)\n/);
  });

  it('aggregates unknown attributes, unresolved sources, descriptions, and review blockers', async () => {
    const root = copyFixture('invalid');
    const report = await migrateDumiDocs({ check: true, root });

    expect(report.unknownAttributes).toEqual([
      expect.objectContaining({
        document: 'src/Broken/index.md',
        line: 8,
        message: expect.stringContaining('surprise'),
      }),
    ]);
    expect(report.duplicateAttributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          document: 'src/Broken/index.md',
          line: 8,
          message: expect.stringContaining('src'),
        }),
        expect.objectContaining({
          document: 'src/Broken/index.md',
          line: 9,
          message: expect.stringContaining('center'),
        }),
      ]),
    );
    expect(report.unresolvedSources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          document: 'src/Broken/index.md',
          message: expect.stringContaining('missing.tsx'),
        }),
        expect.objectContaining({
          document: 'src/Broken/index.md',
          message: expect.stringContaining('source'),
        }),
      ]),
    );
    expect(report.missingDescriptions).toEqual(['src/Broken/index.md']);
    expect(report.apiBodyDispositions.missing).toEqual(['src/Broken/index.md']);
    expect(report.pendingApiOmissions).toEqual([]);
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
  });

  it('requires reasons for preserve-all and replace-all dispositions', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    delete config.documents['src/Preserve/index.md'].api.reason;
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.apiBodyDispositions.missing).toContain('src/Preserve/index.md');
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
  });

  it('blocks replace-tables when reviewed targets cannot map one-to-one to recognized tables', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    config.documents['src/Options/index.md'].api.targets = [{ name: 'Options' }];
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.apiBodyDispositions.missing).toContain('src/Options/index.md');
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
  });

  it('requires explicit selectors for every multi-table or multi-target API section', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const api = config.documents['src/Options/index.md'].api;
    delete api.tableSelectors;
    api.targets = [
      { name: 'OptionsItem' },
      { from: './options', name: 'Options' },
      { name: 'OptionsMetadata' },
    ];
    api.bodySha = 'pending';
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
    const discovery = await migrateDumiDocs({ check: true, root });
    api.bodySha = discovery.apiBodyDispositions.records.find(
      ({ document }) => document === 'src/Options/index.md',
    )?.preservedSha;
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    const record = report.apiBodyDispositions.records.find(
      ({ document }) => document === 'src/Options/index.md',
    );

    expect(record?.diagnostics).toEqual(
      expect.arrayContaining([expect.stringContaining('explicit tableSelectors')]),
    );
    expect(report.apiBodyDispositions.missing).toContain('src/Options/index.md');
  });

  it('aggregates duplicate and out-of-range reviewed API table selectors', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const api = config.documents['src/Options/index.md'].api;
    api.targets.push({ name: 'OptionsMetadata' });
    api.tableSelectors = [
      { unheadedOccurrence: 0 },
      { unheadedOccurrence: 0 },
      { unheadedOccurrence: 99 },
    ];
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    const record = report.apiBodyDispositions.records.find(
      ({ document }) => document === 'src/Options/index.md',
    );

    expect(record?.diagnostics).toEqual(
      expect.arrayContaining([
        expect.stringContaining('already selected'),
        expect.stringContaining('outside the unheaded table range'),
      ]),
    );
    expect(report.apiBodyDispositions.missing).toContain('src/Options/index.md');
  });

  it('keeps reversed selector-to-target mappings stable after migration', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const api = config.documents['src/Options/index.md'].api;
    api.targets = [api.targets[1], api.targets[0]];
    api.tableSelectors = [api.tableSelectors[1], api.tableSelectors[0]];
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    await migrateDumiDocs({ check: false, root, write: true });
    const complete = await migrateDumiDocs({ check: true, root });

    expect(complete.apiBodyDispositions.missing).toEqual([]);
  });

  it('rejects selector drift after generated API components replace their tables', async () => {
    const root = copyFixture('complete');
    await migrateDumiDocs({ check: false, root, write: true });
    const migratedPath = resolve(root, 'src/Options/index.mdx');
    const migratedBefore = readFileSync(migratedPath, 'utf8');
    const migratedMtime = statSync(migratedPath).mtimeMs;
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    config.documents['src/Options/index.md'].api.tableSelectors[0] = {
      unheadedOccurrence: 99,
    };
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.apiBodyDispositions.missing).toContain('src/Options/index.mdx');
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
    expect(readFileSync(migratedPath, 'utf8')).toBe(migratedBefore);
    expect(statSync(migratedPath).mtimeMs).toBe(migratedMtime);
  });

  it('blocks mutation when a reviewed API body SHA no longer matches', async () => {
    const root = copyFixture('complete');
    const path = resolve(root, 'src/Options/index.md');
    writeFileSync(
      path,
      readFileSync(path, 'utf8').replace('Manual API guidance', 'Changed API guidance'),
    );

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.apiBodyDispositions.missing).toContain('src/Options/index.md');
    await expect(migrateDumiDocs({ check: false, root, write: true })).rejects.toBeInstanceOf(
      MigrationBlockedError,
    );
  });

  it('requires a reviewed reason for deliberate API omissions', async () => {
    const root = copyFixture('complete');
    const configPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    config.documents['src/Omitted/index.md'].deliberateApiOmission = true;
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.pendingApiOmissions).toContain('src/Omitted/index.md');
  });

  it('loads reviewed typed migration metadata when Task 10 provides it', async () => {
    const root = copyFixture('complete');
    const jsonPath = resolve(root, 'packages/docs-kit/site/content/migration.json');
    const config = JSON.parse(readFileSync(jsonPath, 'utf8'));
    rmSync(jsonPath);
    writeFileSync(
      resolve(root, 'packages/docs-kit/site/content/migration.ts'),
      `export default ${JSON.stringify(config, null, 2)} as const;\n`,
    );

    const report = await migrateDumiDocs({ check: true, root });
    expect(report.apiBodyDispositions.missing).toEqual([]);
    expect(report.pendingApiOmissions).toEqual([]);
  });
});
