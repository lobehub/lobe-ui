import { dirname, parse, resolve } from 'node:path';

import { kebabCase } from 'es-toolkit/compat';

export interface LegacyDemoIdInput {
  atomId?: string;
  document: string;
  explicitId?: string;
  source: string;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const createDocumentPrefix = (document: string): string => {
  const withoutExtension = normalizePath(document).replaceAll(/((\/|^)index)?\.\w+$/g, '');
  return kebabCase(withoutExtension);
};

const createLocalId = (document: string, source: string): string => {
  const absoluteSource = normalizePath(resolve(dirname(document), source));
  const withoutIndex = absoluteSource.replace(/\/index\.(j|t)sx?$/, '');
  return parse(withoutIndex).name;
};

export function createLegacyDemoId({
  atomId,
  document,
  explicitId,
  source,
}: LegacyDemoIdInput): string {
  const prefix = atomId || createDocumentPrefix(document);
  const localId = explicitId ?? createLocalId(document, source);

  return [prefix.toLowerCase(), 'demo', localId.toLowerCase()].filter(Boolean).join('-');
}
