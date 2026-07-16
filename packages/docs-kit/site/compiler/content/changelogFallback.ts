import { existsSync } from 'node:fs';
import path from 'node:path';

export function shouldUseChangelogFallback(root: string): boolean {
  return (
    !existsSync(path.resolve(root, 'docs/changelog.mdx')) &&
    existsSync(path.resolve(root, 'CHANGELOG.md'))
  );
}
