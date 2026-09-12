'use client';

import { cx } from 'antd-style';
import { memo, useId, useMemo, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import { FocusScope, focusScopeItem, useScopeArrowNav } from '@/base-ui/FocusScope';

import { TreeContext, type TreeContextValue } from './context';
import { styles } from './style';
import TreeNode from './TreeNode';
import type { TreeDataNode, TreeProps } from './type';
import { conductCheck, flattenVisible, getAllKeys, getAncestorKeys, getSubtreeKeys } from './utils';

const EMPTY: string[] = [];

const Tree = memo<TreeProps>(
  ({
    blockNode = false,
    checkStrictly = false,
    checkable = false,
    checkedKeys: checkedKeysProp,
    className,
    classNames = {},
    defaultCheckedKeys = EMPTY,
    defaultExpandAll = false,
    defaultExpandedKeys = EMPTY,
    defaultSelectedKeys = EMPTY,
    disabled = false,
    expandedKeys: expandedKeysProp,
    indent = 20,
    multiple = false,
    onCheck,
    onExpand,
    onRightClick,
    onSelect,
    scopeId: scopeIdProp,
    selectedKeys: selectedKeysProp,
    showIcon = false,
    showLine = false,
    size = 'middle',
    style,
    styles: customStyles = {},
    switcherIcon,
    titleRender,
    treeData,
    vimKeys = false,
  }) => {
    const generatedId = useId();
    const scopeId = scopeIdProp ?? generatedId;
    const [expandedKeys, setExpandedKeys] = useControlledState<string[]>(
      defaultExpandAll ? getAllKeys(treeData) : defaultExpandedKeys,
      { value: expandedKeysProp },
    );
    const [selectedKeys, setSelectedKeys] = useControlledState<string[]>(defaultSelectedKeys, {
      value: selectedKeysProp,
    });
    const [checkedKeys, setCheckedKeys] = useControlledState<string[]>(defaultCheckedKeys, {
      value: checkedKeysProp,
    });

    const expanded = useMemo(() => new Set(expandedKeys), [expandedKeys]);
    const selected = useMemo(() => new Set(selectedKeys), [selectedKeys]);
    const flat = useMemo(() => flattenVisible(treeData, expanded), [treeData, expanded]);
    const { checked, halfChecked } = useMemo(
      () =>
        checkStrictly
          ? { checked: new Set(checkedKeys), halfChecked: new Set<string>() }
          : conductCheck(treeData, checkedKeys),
      [checkStrictly, treeData, checkedKeys],
    );

    const [activeKeyState, setActiveKeyState] = useState<string | null>(null);
    const setActiveKey = setActiveKeyState;
    const activeKey =
      activeKeyState && flat.some((row) => row.node.key === activeKeyState)
        ? activeKeyState
        : (selectedKeys.find((key) => flat.some((row) => row.node.key === key)) ??
          flat[0]?.node.key ??
          null);

    const anchorRef = useRef<string | null>(null);

    const rowOf = (key: string) =>
      document.querySelector<HTMLElement>(`[data-focus-scope="${scopeId}"] [data-id="${key}"]`);
    const focusRow = (key: string) => {
      setActiveKey(key);
      const row = rowOf(key);
      if (row) focusScopeItem(scopeId, row);
    };

    const isDisabled = (node: TreeDataNode) => disabled || !!node.disabled;

    const toggleExpand = (node: TreeDataNode) => {
      const willExpand = !expanded.has(node.key);
      const next = willExpand
        ? [...expandedKeys, node.key]
        : expandedKeys.filter((key) => key !== node.key);
      setExpandedKeys(next);
      onExpand?.(next, { expanded: willExpand, node });
    };

    const toggleSelect: TreeContextValue['toggleSelect'] = (node, event) => {
      if (isDisabled(node) || node.selectable === false) return;
      let next: string[];
      if (multiple && event?.shiftKey && anchorRef.current) {
        const a = flat.findIndex((row) => row.node.key === anchorRef.current);
        const b = flat.findIndex((row) => row.node.key === node.key);
        next = flat
          .slice(Math.min(a, b), Math.max(a, b) + 1)
          .filter((row) => !isDisabled(row.node) && row.node.selectable !== false)
          .map((row) => row.node.key);
      } else if (multiple && (event?.metaKey || event?.ctrlKey)) {
        next = selected.has(node.key)
          ? selectedKeys.filter((key) => key !== node.key)
          : [...selectedKeys, node.key];
        anchorRef.current = node.key;
      } else {
        next = [node.key];
        anchorRef.current = node.key;
      }
      setSelectedKeys(next);
      setActiveKey(node.key);
      onSelect?.(next, { node, selected: next.includes(node.key) });
    };

    const toggleCheck = (node: TreeDataNode) => {
      if (isDisabled(node) || node.checkable === false) return;
      const willCheck = !checked.has(node.key);
      const keys = checkStrictly ? [node.key] : getSubtreeKeys(node);
      const base = new Set(checkStrictly ? checkedKeys : checked);
      keys.forEach((key) => (willCheck ? base.add(key) : base.delete(key)));
      if (!willCheck && !checkStrictly) getAncestorKeys(treeData, node.key).forEach((key) => base.delete(key));
      const next = checkStrictly ? [...base] : [...conductCheck(treeData, base).checked];
      setCheckedKeys(next);
      setActiveKey(node.key);
      onCheck?.(next, { checked: willCheck, node });
    };

    const currentRow = () => {
      const focused = document.activeElement?.closest<HTMLElement>('[role="treeitem"]');
      const key = focused?.dataset.id ?? activeKey;
      return flat.find((row) => row.node.key === key);
    };

    const withRow = (fn: (row: (typeof flat)[number], event: KeyboardEvent) => void) =>
      (event: KeyboardEvent) => {
        const row = currentRow();
        if (row) fn(row, event);
      };

    useScopeArrowNav({
      extra: {
        ' ': withRow((row, event) => {
          if (checkable && row.node.checkable !== false) toggleCheck(row.node);
          else toggleSelect(row.node, event);
        }),
        '*': withRow((row) => {
          const siblings = flat.filter(
            (r) => r.parentKey === row.parentKey && r.hasChildren && !expanded.has(r.node.key),
          );
          if (siblings.length === 0) return;
          const next = [...expandedKeys, ...siblings.map((r) => r.node.key)];
          setExpandedKeys(next);
          onExpand?.(next, { expanded: true, node: row.node });
        }),
        ArrowLeft: withRow((row) => {
          if (row.hasChildren && expanded.has(row.node.key)) toggleExpand(row.node);
          else if (row.parentKey) focusRow(row.parentKey);
        }),
        ArrowRight: withRow((row) => {
          if (!row.hasChildren) return;
          if (expanded.has(row.node.key)) focusRow(flat[row.index + 1].node.key);
          else toggleExpand(row.node);
        }),
        Enter: withRow((row, event) => toggleSelect(row.node, event)),
      },
      itemSelector: '[role="treeitem"]',
      onItemFocus: (el) => el.dataset.id && setActiveKey(el.dataset.id),
      scopeId,
      vimKeys,
    });

    const ctx: TreeContextValue = {
      activeKey,
      blockNode,
      checkable,
      checked,
      classNames,
      disabled,
      expanded,
      halfChecked,
      indent,
      onRightClick: (event, node) => onRightClick?.({ event, node }),
      selected,
      setActiveKey,
      showIcon,
      showLine,
      size,
      styles: customStyles,
      switcherIcon,
      titleRender,
      toggleCheck,
      toggleExpand,
      toggleSelect,
    };

    return (
      <TreeContext value={ctx}>
        <FocusScope
          className={cx(styles.root, classNames.root, className)}
          id={scopeId}
          role="tree"
          style={{ ...customStyles.root, ...style }}
        >
          {treeData.map((node, i) => (
            <TreeNode
              depth={0}
              isLast={i === treeData.length - 1}
              key={node.key}
              node={node}
              trail={[]}
            />
          ))}
        </FocusScope>
      </TreeContext>
    );
  },
);

Tree.displayName = 'Tree';

export default Tree;
