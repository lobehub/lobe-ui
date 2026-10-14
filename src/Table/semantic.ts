import clsx from 'clsx';
import { type CSSProperties, useRef } from 'react';

import type { PaginationSemanticName } from '@/Pagination/type';

import type {
  TableClassNames,
  TableComponentsSemanticName,
  TableProps,
  TableSemanticInfo,
  TableStyles,
} from './type';

type Components<V> = Partial<Record<TableComponentsSemanticName, V>>;

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

export const resolveSemantic = <V, T>(
  value: V | ((info: TableSemanticInfo<T>) => V) | undefined,
  info: TableSemanticInfo<T>,
): V | undefined =>
  typeof value === 'function' ? (value as (info: TableSemanticInfo<T>) => V)(info) : value;

export const normalizeClassNames = (
  classNames: TableClassNames | undefined,
): NormalizedSemantic<string> => {
  const { body, header, pagination, ...rest } = classNames ?? {};
  return { ...rest, body: { ...body }, header: { ...header }, pagination: { ...pagination } };
};

export const normalizeStyles = (
  styles: TableStyles | undefined,
): NormalizedSemantic<CSSProperties> => {
  const { body, header, pagination, ...rest } = styles ?? {};
  return { ...rest, body: { ...body }, header: { ...header }, pagination: { ...pagination } };
};

export const mergeClassName = (...names: (string | false | null | undefined)[]) =>
  clsx(...names) || undefined;

export const mergeStyle = (...styles: (CSSProperties | undefined)[]) =>
  styles.some(Boolean) ? Object.assign({}, ...styles) : undefined;

const sameValue = (a: unknown, b: unknown, depth: number): boolean => {
  if (Object.is(a, b)) return true;
  if (depth === 0 || typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((key) => sameValue((a as any)[key], (b as any)[key], depth - 1));
};

const useStableValue = <V>(value: V): V => {
  const ref = useRef(value);
  if (!sameValue(ref.current, value, 3)) ref.current = value;
  return ref.current;
};

export const useStableSemantic = <T>(
  classNames: TableClassNames | ((info: TableSemanticInfo<T>) => TableClassNames) | undefined,
  styles: TableStyles | ((info: TableSemanticInfo<T>) => TableStyles) | undefined,
  props: TableProps<T>,
) => {
  const info = { props };
  return {
    classNames: useStableValue(normalizeClassNames(resolveSemantic(classNames, info))),
    styles: useStableValue(normalizeStyles(resolveSemantic(styles, info))),
  };
};
