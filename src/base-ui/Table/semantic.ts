import { cx } from 'antd-style';
import type { CSSProperties } from 'react';

import type { PaginationSemanticName } from '@/base-ui/Pagination/type';

import type {
  TableClassNames,
  TableComponentsSemanticName,
  TableSemanticInfo,
  TableStyles,
} from './type';

type Components<V> = Partial<Record<TableComponentsSemanticName, V>>;

/** antd 6 Semantic DOM shape, once legacy flat keys are folded in. */
export interface NormalizedSemantic<V> {
  body: Components<V>;
  content?: V;
  footer?: V;
  header: Components<V>;
  pagination: Partial<Record<PaginationSemanticName, V>>;
  root?: V;
  section?: V;
  title?: V;
}

const COMPONENT_KEYS: TableComponentsSemanticName[] = ['cell', 'row', 'wrapper'];

/** A `header` / `body` style object is nested when it uses `wrapper` / `row` / `cell` keys. */
const isComponentsStyles = (value: object): value is Components<CSSProperties> =>
  COMPONENT_KEYS.some((key) => key in value);

/** antd `classNames` / `styles` accept a function of `{ props }`. */
export const resolveSemantic = <V, T>(
  value: V | ((info: TableSemanticInfo<T>) => V) | undefined,
  info: TableSemanticInfo<T>,
): V | undefined =>
  typeof value === 'function' ? (value as (info: TableSemanticInfo<T>) => V)(info) : value;

const mergeClassName = (...names: (string | undefined)[]) => cx(...names) || undefined;

const mergeStyle = (...styles: (CSSProperties | undefined)[]) =>
  styles.some(Boolean) ? Object.assign({}, ...styles) : undefined;

/**
 * Folds the legacy flat keys into the antd 6 structure: `wrapper` → `section`,
 * `header` (string) → `header.cell`, `body` (string) → `body.wrapper`, `row` → `body.row`,
 * `cell` → `body.cell`.
 */
export const normalizeClassNames = (
  classNames: TableClassNames | undefined,
): NormalizedSemantic<string> => {
  const { body, cell, header, pagination, row, section, wrapper, ...rest } = classNames ?? {};
  const headerNames = typeof header === 'string' ? { cell: header } : header;
  const bodyNames = typeof body === 'string' ? { wrapper: body } : body;
  return {
    ...rest,
    body: {
      cell: mergeClassName(cell, bodyNames?.cell),
      row: mergeClassName(row, bodyNames?.row),
      wrapper: bodyNames?.wrapper,
    },
    header: { ...headerNames },
    pagination: { ...pagination },
    section: mergeClassName(wrapper, section),
  };
};

/** Same as `normalizeClassNames`; a `header` / `body` without component keys is a flat style. */
export const normalizeStyles = (
  styles: TableStyles | undefined,
): NormalizedSemantic<CSSProperties> => {
  const { body, cell, header, pagination, row, section, wrapper, ...rest } = styles ?? {};
  const headerStyles = header && !isComponentsStyles(header) ? { cell: header } : header;
  const bodyStyles = body && !isComponentsStyles(body) ? { wrapper: body } : body;
  return {
    ...rest,
    body: {
      cell: mergeStyle(cell, (bodyStyles as Components<CSSProperties>)?.cell),
      row: mergeStyle(row, (bodyStyles as Components<CSSProperties>)?.row),
      wrapper: (bodyStyles as Components<CSSProperties>)?.wrapper,
    },
    header: { ...(headerStyles as Components<CSSProperties>) },
    pagination: { ...pagination },
    section: mergeStyle(wrapper, section),
  };
};
