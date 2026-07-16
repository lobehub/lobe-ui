import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface PackageBinResolver {
  resolve: (request: string) => string;
}

// `@react-router/dev`'s `exports` map does not expose `./bin.cjs`, so it
// cannot be `require.resolve`d directly — derive it from the package's own
// `bin` field instead, which its `package.json` subpath does expose.
export const resolveBin = (
  packageName: string,
  binName: string,
  requireFn: PackageBinResolver['resolve'],
  readFileFn: (filePath: string) => string = (filePath) => readFileSync(filePath, 'utf8'),
): string => {
  const packageJsonPath = requireFn(`${packageName}/package.json`);
  const packageJson = JSON.parse(readFileFn(packageJsonPath)) as {
    bin?: Record<string, string> | string;
  };

  const binEntry =
    typeof packageJson.bin === 'string' ? packageJson.bin : packageJson.bin?.[binName];

  if (!binEntry) {
    throw new Error(`Unable to resolve the "${binName}" bin entry for package "${packageName}".`);
  }

  return path.join(path.dirname(packageJsonPath), binEntry);
};
