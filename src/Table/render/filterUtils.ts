import * as stylex from '@stylexjs/stylex';
import type { Key, ReactNode } from 'react';

import { getAllKeys, type TreeDataNode } from '@/Tree';

import { PREFIX_CLS } from '../constants';

export const sx = (...list: (stylex.StyleXStyles | false | null | undefined)[]) =>
  stylex.props(...list).className;

export const FILTER_CLS = `${PREFIX_CLS}-filter`;

export const sameKeys = (
  a: readonly Key[] | null | undefined,
  b: readonly Key[] | null | undefined,
) =>
  (a ?? null) === (b ?? null) ||
  (Boolean(a) && Boolean(b) && a!.length === b!.length && a!.every((key, i) => key === b![i]));

export const textMatches = (search: string, text: ReactNode) =>
  (typeof text === 'string' || typeof text === 'number') &&
  String(text).toLowerCase().includes(search);

export const findLineage = (
  nodes: readonly TreeDataNode[],
  key: string,
  ancestors: string[] = [],
): { ancestors: string[]; subtree: string[] } | undefined => {
  for (const node of nodes) {
    if (node.key === key) return { ancestors, subtree: getAllKeys([node]) };
    const found = node.children && findLineage(node.children, key, [...ancestors, node.key]);
    if (found) return found;
  }
};
