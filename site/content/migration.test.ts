// @vitest-environment node

import path from 'node:path';

import { migrateDumiDocs } from '../../scripts/migrate-dumi-docs';
import { extractComponentApi } from '../compiler/api/extractComponent';
import migration from './migration';

const repositoryRoot = path.resolve(import.meta.dirname, '../..');

describe('reviewed production migration metadata', () => {
  it('grounds demo-only API omission reasons in the frozen page evidence', () => {
    for (const document of [
      'src/base-ui/FloatingSheet/index.mdx',
      'src/base-ui/Switch/index.mdx',
    ]) {
      expect(migration.documents?.[document]?.deliberateApiOmission).toEqual({
        reason:
          'The frozen page documents behavior through demos and has no legacy API section; preserve that reviewed omission during migration.',
      });
    }
  });

  it('closes every review blocker while preserving the frozen corpus equations', async () => {
    const report = await migrateDumiDocs({ check: true, root: repositoryRoot });

    expect(report).toMatchObject({
      acknowledgedStandaloneOnly: 1,
      apiSections: 124,
      apiSourceOverrides: 79,
      deliberateApiOmissions: 34,
      isolatedDemos: 35,
      missingDescriptions: [],
      pendingApiOmissions: [],
      unknownAttributes: [],
      unpersistedMetadata: [],
      unresolvedSources: [],
    });
    expect(report.apiBodyDispositions.missing).toEqual([]);
    expect(report.apiBodyDispositions.manualSections).toBe(68);
    expect(
      report.apiBodyDispositions.records.filter(
        ({ disposition }) => disposition === 'replace-tables',
      ),
    ).toHaveLength(108);
    expect(
      report.apiBodyDispositions.records.filter(({ disposition }) => disposition === 'replace-all'),
    ).toHaveLength(10);
    expect(
      report.apiBodyDispositions.records.filter(
        ({ disposition }) => disposition === 'preserve-all',
      ),
    ).toHaveLength(6);
    expect(report.destinationConflicts).toEqual([]);
    expect(report.duplicateAttributes).toEqual([]);
    expect(report.invariantDiagnostics).toEqual([]);
    expect(
      report.metadata
        .filter(({ category, source }) => source.startsWith('src/') && !category)
        .map(({ source }) => source),
    ).toEqual([]);
    expect(report.legacyDocuments + report.migratedDocuments).toBe(160);
    expect(
      report.legacyDemoTags + report.migratedDemoUses + report.acknowledgedStandaloneOnly,
    ).toBe(367);
    expect(report.apiSections + report.deliberateApiOmissions).toBe(158);
  });

  it('resolves every reviewed callable target through its intended public barrel', () => {
    const failures: string[] = [];

    for (const [document, config] of Object.entries(migration.documents ?? {})) {
      for (const target of config.api?.targets ?? []) {
        try {
          extractComponentApi({
            documentPath: path.resolve(repositoryRoot, document),
            ...target,
            tsconfigPath: path.resolve(repositoryRoot, 'tsconfig.json'),
          });
        } catch (error) {
          failures.push(
            `${document}#${target.name}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);
});
