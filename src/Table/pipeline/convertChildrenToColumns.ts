import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';

import type { TableColumn } from '../type';

const toElements = (children: ReactNode): ReactElement[] => {
  const list: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Fragment) {
      list.push(...toElements((child.props as { children?: ReactNode }).children));
    } else {
      list.push(child);
    }
  });
  return list;
};

export const convertChildrenToColumns = <T>(children: ReactNode): TableColumn<T>[] =>
  toElements(children).map((node) => {
    const { children: nodeChildren, ...rest } = node.props as Record<string, unknown>;
    const column: Record<string, unknown> = { key: node.key ?? undefined, ...rest };
    if (nodeChildren) column.children = convertChildrenToColumns<T>(nodeChildren as ReactNode);
    return column as unknown as TableColumn<T>;
  });
