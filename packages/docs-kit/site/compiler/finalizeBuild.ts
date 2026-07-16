import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compatibilityJson from '../content/compatibility.json';
import type { DocumentManifestEntry } from '../types/content';
import {
  type ArtifactAuditOptions,
  auditDocumentationArtifact,
  type MigrationCoverageResult,
} from './audit/artifactAudit';
import { createContentManifest } from './content/createManifest';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';
import { buildPagefind } from './search/buildPagefind';
import { createRobots, createSitemap } from './seo/createSitemap';
import type { DocumentationInventory } from './types';

export { auditStandaloneBundleIsolation } from './audit/artifactAudit';

export interface FinalizeBuildOptions {
  clientDirectory: string;
  outputDirectory: string;
  repositoryRoot?: string;
}

export interface FinalizeBuildDependencies {
  auditArtifact?: (options: ArtifactAuditOptions) => MigrationCoverageResult;
  buildSearchIndex?: typeof buildPagefind;
  compatibility?: DocumentationInventory;
  documents?: DocumentManifestEntry[];
  expectedStandalonePaths?: string[];
  fileSystem?: FinalizeFileSystem;
  onCleanupError?: (error: unknown) => void;
}

export interface FinalizeFileSystem {
  remove: (target: string, options: { force: boolean; recursive: boolean }) => void;
  rename: (source: string, destination: string) => void;
}

const defaultFileSystem: FinalizeFileSystem = {
  remove: (target, options) => rmSync(target, options),
  rename: renameSync,
};

const reportCleanupError = (
  error: unknown,
  onCleanupError: ((error: unknown) => void) | undefined,
): void => {
  try {
    if (onCleanupError) onCleanupError(error);
    else console.warn('Documentation artifact cleanup failed:', error);
  } catch (reportError) {
    console.warn('Documentation artifact cleanup error reporting failed:', reportError);
  }
};

const promoteArtifact = (
  stagedDirectory: string,
  outputDirectory: string,
  workDirectory: string,
  fileSystem: FinalizeFileSystem,
  onCleanupError?: (error: unknown) => void,
) => {
  const previousDirectory = path.resolve(
    path.dirname(outputDirectory),
    `.${path.basename(outputDirectory)}-previous-${path.basename(workDirectory)}`,
  );
  const hadPrevious = existsSync(outputDirectory);
  if (hadPrevious) fileSystem.rename(outputDirectory, previousDirectory);

  try {
    fileSystem.rename(stagedDirectory, outputDirectory);
  } catch (promotionError) {
    if (hadPrevious && existsSync(previousDirectory) && !existsSync(outputDirectory)) {
      try {
        fileSystem.rename(previousDirectory, outputDirectory);
      } catch (rollbackError) {
        throw new AggregateError(
          [promotionError, rollbackError],
          `Artifact promotion and rollback failed; previous artifact retained at ${previousDirectory}.`,
          { cause: rollbackError },
        );
      }
    }
    throw promotionError;
  }

  if (hadPrevious) {
    try {
      fileSystem.remove(previousDirectory, { force: true, recursive: true });
    } catch (error) {
      reportCleanupError(error, onCleanupError);
    }
  }
};

export async function finalizeDocumentationBuild(
  { clientDirectory, outputDirectory, repositoryRoot }: FinalizeBuildOptions,
  dependencies: FinalizeBuildDependencies = {},
): Promise<MigrationCoverageResult> {
  const root = path.resolve(repositoryRoot ?? path.resolve(import.meta.dirname, '../../../..'));
  const client = path.resolve(clientDirectory);
  const output = path.resolve(outputDirectory);
  const outputParent = path.dirname(output);
  mkdirSync(outputParent, { recursive: true });
  const workDirectory = mkdtempSync(path.resolve(outputParent, `.${path.basename(output)}-stage-`));
  const stagedDirectory = path.resolve(workDirectory, 'artifact');
  const fileSystem = dependencies.fileSystem ?? defaultFileSystem;

  try {
    const compatibility =
      dependencies.compatibility ?? (compatibilityJson as DocumentationInventory);
    const documents = dependencies.documents ?? createContentManifest(root).documents;
    const expectedStandalonePaths =
      dependencies.expectedStandalonePaths ?? getStandaloneDemoPaths(compatibility);
    const buildSearchIndex = dependencies.buildSearchIndex ?? buildPagefind;
    const auditArtifact = dependencies.auditArtifact ?? auditDocumentationArtifact;

    cpSync(client, stagedDirectory, { recursive: true });
    copyFileSync(
      path.resolve(stagedDirectory, '404/index.html'),
      path.resolve(stagedDirectory, '404.html'),
    );

    await buildSearchIndex({
      inputDirectory: stagedDirectory,
      outputDirectory: path.resolve(stagedDirectory, 'pagefind'),
    });
    writeFileSync(
      path.resolve(stagedDirectory, 'sitemap.xml'),
      createSitemap(documents.map(({ pathname }) => pathname)),
    );
    writeFileSync(path.resolve(stagedDirectory, 'robots.txt'), createRobots());

    const coverage = auditArtifact({
      clientDirectory: client,
      compatibility,
      documents,
      expectedStandalonePaths,
      outputDirectory: stagedDirectory,
      repositoryRoot: root,
    });
    promoteArtifact(
      stagedDirectory,
      output,
      workDirectory,
      fileSystem,
      dependencies.onCleanupError,
    );
    return coverage;
  } finally {
    try {
      rmSync(workDirectory, { force: true, recursive: true });
    } catch (error) {
      reportCleanupError(error, dependencies.onCleanupError);
    }
  }
}

const entryPath = process.argv[1];

if (entryPath && fileURLToPath(import.meta.url) === path.resolve(entryPath)) {
  void finalizeDocumentationBuild({
    clientDirectory: path.resolve('.react-router/build/client'),
    outputDirectory: path.resolve('dist'),
  }).catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
