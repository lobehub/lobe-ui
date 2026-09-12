import { createContext, type MouseEvent, type ReactNode, use } from 'react';

import type { ControlSize } from '../controlSize';
import type { TreeClassNames, TreeDataNode, TreeProps, TreeStyles } from './type';

export interface TreeContextValue {
  activeKey: string | null;
  blockNode: boolean;
  checkable: boolean;
  checked: Set<string>;
  classNames: TreeClassNames;
  disabled: boolean;
  expanded: Set<string>;
  halfChecked: Set<string>;
  indent: number;
  onRightClick: (event: MouseEvent<HTMLDivElement>, node: TreeDataNode) => void;
  selected: Set<string>;
  setActiveKey: (key: string) => void;
  showIcon: boolean;
  showLine: boolean;
  size: ControlSize;
  styles: TreeStyles;
  switcherIcon?: TreeProps['switcherIcon'];
  titleRender?: (node: TreeDataNode) => ReactNode;
  toggleCheck: (node: TreeDataNode) => void;
  toggleExpand: (node: TreeDataNode) => void;
  toggleSelect: (node: TreeDataNode, event?: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean }) => void;
}

export const TreeContext = createContext<TreeContextValue | null>(null);

export const useTreeContext = () => {
  const ctx = use(TreeContext);
  if (!ctx) throw new Error('Tree components must be rendered inside <Tree>');
  return ctx;
};
