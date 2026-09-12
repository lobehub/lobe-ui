'use client';

import { cx } from 'antd-style';
import { type KeyboardEvent, memo, useCallback, useMemo, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

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
    selectedKeys: selectedKeysProp,
    showIcon = false,
    showLine = false,
    size = 'middle',
    style,
    styles: customStyles = {},
    switcherIcon,
    titleRender,
    treeData,
  }) => {
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

    const rowsRef = useRef(new Map<string, HTMLDivElement>());
    const anchorRef = useRef<string | null>(null);

    const registerRow = useCallback((key: string, el: HTMLDivElement | null) => {
      if (el) rowsRef.current.set(key, el);
      else rowsRef.current.delete(key);
    }, []);

    const focusRow = (key: string) => {
      setActiveKey(key);
      rowsRef.current.get(key)?.focus();
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

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const index = flat.findIndex((row) => row.node.key === activeKey);
      if (index < 0) return;
      const row = flat[index];
      const isOpen = row.hasChildren && expanded.has(row.node.key);
      const handlers: Record<string, () => void> = {
        ' ': () => {
          if (checkable && row.node.checkable !== false) toggleCheck(row.node);
          else toggleSelect(row.node, event);
        },
        '*': () => {
          const siblings = flat.filter(
            (r) => r.parentKey === row.parentKey && r.hasChildren && !expanded.has(r.node.key),
          );
          if (siblings.length === 0) return;
          const next = [...expandedKeys, ...siblings.map((r) => r.node.key)];
          setExpandedKeys(next);
          onExpand?.(next, { expanded: true, node: row.node });
        },
        ArrowDown: () => flat[index + 1] && focusRow(flat[index + 1].node.key),
        ArrowLeft: () => {
          if (isOpen) toggleExpand(row.node);
          else if (row.parentKey) focusRow(row.parentKey);
        },
        ArrowRight: () => {
          if (!row.hasChildren) return;
          if (isOpen) focusRow(flat[index + 1].node.key);
          else toggleExpand(row.node);
        },
        ArrowUp: () => flat[index - 1] && focusRow(flat[index - 1].node.key),
        End: () => focusRow(flat.at(-1)!.node.key),
        Enter: () => toggleSelect(row.node, event),
        Home: () => focusRow(flat[0].node.key),
      };
      const handler = handlers[event.key];
      if (!handler) return;
      event.preventDefault();
      handler();
    };

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
      registerRow,
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
        <div
          className={cx(styles.root, classNames.root, className)}
          role="tree"
          style={{ ...customStyles.root, ...style }}
          onKeyDown={onKeyDown}
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
        </div>
      </TreeContext>
    );
  },
);

Tree.displayName = 'Tree';

export default Tree;
