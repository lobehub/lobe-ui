import type { AtomDirConfig } from '../../../src/config';

export const kebabRouteSegment = (value: string): string =>
  value
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/[’']/g, '')
    .replaceAll(/[^A-Za-z\d]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();

export const resolveAtomDir = (
  source: string,
  atomDirs: readonly AtomDirConfig[],
): AtomDirConfig => {
  const atomDir = atomDirs.find(({ dir }) => source.startsWith(`${dir}/`));
  if (!atomDir) throw new Error(`Unable to resolve documentation route for ${source}`);
  return atomDir;
};

export interface ComponentRoute {
  pathname: string;
  segments: string[];
}

export function deriveComponentRoute(
  componentPath: string,
  atomDir: AtomDirConfig,
  atomDirs: readonly AtomDirConfig[],
): ComponentRoute {
  const segments = componentPath.split('/').map(kebabRouteSegment);
  if (atomDirs.length > 1 && atomDir.subType) segments.unshift(kebabRouteSegment(atomDir.subType));
  return { pathname: `/components/${segments.join('/')}`, segments };
}
