import type { TreeDataNode, TreeFlatRow } from './type';

export const hasChildren = (node: TreeDataNode) =>
  !node.isLeaf && !!node.children && node.children.length > 0;

export const flattenVisible = (
  data: TreeDataNode[],
  expanded: Set<string>,
  depth = 0,
  parentKey: string | null = null,
  trail: boolean[] = [],
  out: TreeFlatRow[] = [],
): TreeFlatRow[] => {
  data.forEach((node, i) => {
    const isLast = i === data.length - 1;
    const expandable = hasChildren(node);
    out.push({ depth, hasChildren: expandable, index: out.length, isLast, node, parentKey, trail });
    if (expandable && expanded.has(node.key)) {
      flattenVisible(node.children!, expanded, depth + 1, node.key, [...trail, !isLast], out);
    }
  });
  return out;
};

export const getAllKeys = (data: TreeDataNode[], out: string[] = []): string[] => {
  for (const node of data) {
    out.push(node.key);
    if (node.children) getAllKeys(node.children, out);
  }
  return out;
};

export const findNode = (data: TreeDataNode[], key: string): TreeDataNode | undefined => {
  for (const node of data) {
    if (node.key === key) return node;
    const found = node.children && findNode(node.children, key);
    if (found) return found;
  }
};

const isCheckable = (node: TreeDataNode) => node.checkable !== false && !node.disabled;

export const getSubtreeKeys = (node: TreeDataNode, out: string[] = []): string[] => {
  if (isCheckable(node)) out.push(node.key);
  node.children?.forEach((child) => getSubtreeKeys(child, out));
  return out;
};

export const conductCheck = (data: TreeDataNode[], checkedKeys: Iterable<string>) => {
  const checked = new Set(checkedKeys);
  const halfChecked = new Set<string>();

  const down = (node: TreeDataNode, inherited: boolean) => {
    const on = inherited || checked.has(node.key);
    if (on && isCheckable(node)) checked.add(node.key);
    node.children?.forEach((child) => down(child, on && isCheckable(node)));
  };
  data.forEach((node) => down(node, false));

  const walk = (node: TreeDataNode): boolean => {
    const kids = (node.children ?? []).filter(isCheckable);
    if (kids.length === 0) return checked.has(node.key);
    const results = kids.map(walk);
    if (results.every(Boolean)) {
      checked.add(node.key);
      return true;
    }
    checked.delete(node.key);
    if (results.some(Boolean) || kids.some((kid) => halfChecked.has(kid.key))) {
      halfChecked.add(node.key);
    }
    return false;
  };

  data.forEach(walk);
  return { checked, halfChecked };
};

export const getAncestorKeys = (
  data: TreeDataNode[],
  key: string,
  path: string[] = [],
): string[] => {
  for (const node of data) {
    if (node.key === key) return [...path].reverse();
    if (node.children) {
      const found = getAncestorKeys(node.children, key, [...path, node.key]);
      if (found.length > 0 || node.children.some((c) => c.key === key)) return found;
    }
  }
  return [];
};
