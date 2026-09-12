import type { CSSProperties, MouseEvent, ReactNode } from 'react';

import type { ControlSize } from '../controlSize';

export interface TreeDataNode {
  checkable?: boolean;
  children?: TreeDataNode[];
  disabled?: boolean;
  icon?: ReactNode;
  isLeaf?: boolean;
  key: string;
  selectable?: boolean;
  title: ReactNode;
}

export interface TreeFlatRow {
  depth: number;
  hasChildren: boolean;
  index: number;
  isLast: boolean;
  node: TreeDataNode;
  parentKey: string | null;
  trail: boolean[];
}

export interface TreeClassNames {
  guide?: string;
  node?: string;
  root?: string;
  switcher?: string;
  title?: string;
}

export interface TreeStyles {
  guide?: CSSProperties;
  node?: CSSProperties;
  root?: CSSProperties;
  switcher?: CSSProperties;
  title?: CSSProperties;
}

export interface TreeProps {
  blockNode?: boolean;
  checkable?: boolean;
  checkedKeys?: string[];
  checkStrictly?: boolean;
  className?: string;
  classNames?: TreeClassNames;
  defaultCheckedKeys?: string[];
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: string[];
  defaultSelectedKeys?: string[];
  disabled?: boolean;
  expandedKeys?: string[];
  indent?: number;
  multiple?: boolean;
  onCheck?: (keys: string[], info: { checked: boolean; node: TreeDataNode }) => void;
  onExpand?: (keys: string[], info: { expanded: boolean; node: TreeDataNode }) => void;
  onRightClick?: (info: { event: MouseEvent<HTMLDivElement>; node: TreeDataNode }) => void;
  onSelect?: (keys: string[], info: { node: TreeDataNode; selected: boolean }) => void;
  selectedKeys?: string[];
  showIcon?: boolean;
  showLine?: boolean;
  size?: ControlSize;
  style?: CSSProperties;
  styles?: TreeStyles;
  switcherIcon?: ReactNode | ((info: { expanded: boolean; node: TreeDataNode }) => ReactNode);
  titleRender?: (node: TreeDataNode) => ReactNode;
  treeData: TreeDataNode[];
}
