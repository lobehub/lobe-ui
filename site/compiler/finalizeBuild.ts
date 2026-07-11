import { copyFileSync, cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface FinalizeBuildOptions {
  clientDirectory: string;
  outputDirectory: string;
}

export function finalizeDocumentationBuild({
  clientDirectory,
  outputDirectory,
}: FinalizeBuildOptions): void {
  rmSync(outputDirectory, { force: true, recursive: true });
  cpSync(clientDirectory, outputDirectory, { recursive: true });
  copyFileSync(
    path.resolve(outputDirectory, '__spa-fallback.html'),
    path.resolve(outputDirectory, '404.html'),
  );
}

const entryPath = process.argv[1];

if (entryPath && fileURLToPath(import.meta.url) === path.resolve(entryPath)) {
  finalizeDocumentationBuild({
    clientDirectory: path.resolve('.react-router/build/client'),
    outputDirectory: path.resolve('dist'),
  });
}
