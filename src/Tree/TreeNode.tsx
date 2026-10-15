'use client';

import './style.css';

import { Collapsible } from '@base-ui/react/collapsible';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronRight, File, Folder } from 'lucide-react';
import { type CSSProperties, memo, type MouseEvent } from 'react';

import { Checkbox } from '@/Checkbox';
import Icon from '@/Icon';
import { controlHeight } from '@/internal/controlSize';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { useTreeContext } from './context';
import { styles } from './style';
import type { TreeDataNode } from './type';
import { hasChildren as isExpandable } from './utils';

interface TreeNodeProps {
  depth: number;
  isLast: boolean;
  node: TreeDataNode;
  trail: boolean[];
}

const ARC = 6;
const SWITCHER_CENTER = 11.5;

const guidePath = (
  depth: number,
  isLast: boolean,
  trail: boolean[],
  indent: number,
  height: number,
) => {
  const cx = (i: number) => i * indent + SWITCHER_CENTER;
  let d = '';
  trail.forEach((more, i) => {
    if (more && i > 0) d += `M${cx(i)} 0V${height}`;
  });
  const x = cx(depth - 1);
  const y = height / 2;
  const elbow = `M${x} ${y - ARC}A${ARC} ${ARC} 0 0 0 ${x + ARC} ${y}H${x + indent - 2}`;
  d += isLast
    ? `M${x} 0V${y - ARC}${elbow.slice(elbow.indexOf('A'))}`
    : `M${x} 0V${height}${elbow}`;
  return d;
};

const TreeNode = memo<TreeNodeProps>(({ node, depth, isLast, trail }) => {
  const ctx = useTreeContext();
  const expandable = isExpandable(node);
  const expanded = expandable && ctx.expanded.has(node.key);
  const disabled = ctx.disabled || !!node.disabled;
  const selected = ctx.selected.has(node.key);
  const checkable = ctx.checkable && node.checkable !== false;
  const checkState = ctx.checked.has(node.key)
    ? 'checked'
    : ctx.halfChecked.has(node.key)
      ? 'mixed'
      : 'unchecked';
  const rowHeight =
    typeof ctx.styles.node?.height === 'number' ? ctx.styles.node.height : controlHeight[ctx.size];

  const switcherIcon =
    typeof ctx.switcherIcon === 'function'
      ? ctx.switcherIcon({ expanded, node })
      : (ctx.switcherIcon ?? <Icon icon={ChevronRight} size={14} />);

  const rowStyle: CSSProperties = {
    height: rowHeight,
    paddingInlineStart: depth * ctx.indent,
    ...ctx.styles.node,
  };

  const select = (event: MouseEvent) => ctx.toggleSelect(node, event);

  return (
    <>
      <div
        data-scope-item
        aria-disabled={disabled || undefined}
        aria-expanded={expandable ? expanded : undefined}
        aria-level={depth + 1}
        aria-selected={selected}
        data-id={node.key}
        role="treeitem"
        tabIndex={ctx.activeKey === node.key ? 0 : -1}
        aria-checked={
          checkable ? (checkState === 'mixed' ? 'mixed' : checkState === 'checked') : undefined
        }
        {...styleProps(
          [
            styles.node,
            focusRing.info,
            ctx.blockNode && [
              styles.nodeBlock,
              disabled
                ? selected && styles.nodeDisabledSelected
                : selected
                  ? styles.nodeSelected
                  : styles.nodeHover,
            ],
            disabled && styles.nodeDisabled,
          ],
          ctx.classNames.node,
          rowStyle,
        )}
        onClick={ctx.blockNode ? select : undefined}
        onContextMenu={(event) => ctx.onRightClick(event, node)}
        onFocus={() => ctx.setActiveKey(node.key)}
      >
        {ctx.showLine && depth > 0 && (
          <svg
            aria-hidden
            height={rowHeight}
            width={depth * ctx.indent}
            {...styleProps(styles.guide, ctx.classNames.guide, ctx.styles.guide)}
          >
            <path
              {...stylex.props(styles.guidePath)}
              d={guidePath(depth, isLast, trail, ctx.indent, rowHeight)}
            />
          </svg>
        )}
        <button
          aria-hidden
          tabIndex={-1}
          type="button"
          {...styleProps(
            [styles.switcher, !expandable && styles.switcherLeaf],
            clsx('lobe-tree-switcher', ctx.classNames.switcher),
            ctx.styles.switcher,
          )}
          onClick={(event) => {
            event.stopPropagation();
            ctx.toggleExpand(node);
          }}
        >
          {switcherIcon}
        </button>
        {checkable && (
          <Checkbox
            checked={checkState === 'checked'}
            className={stylex.props(styles.checkbox).className}
            disabled={disabled}
            indeterminate={checkState === 'mixed'}
            onChange={() => ctx.toggleCheck(node)}
            onClick={(event) => event.stopPropagation()}
          />
        )}
        {ctx.showIcon && (
          <span {...stylex.props(styles.icon)}>
            {node.icon ?? <Icon icon={expandable ? Folder : File} size={16} />}
          </span>
        )}
        <span
          {...styleProps(
            [
              styles.title,
              ctx.blockNode
                ? styles.titleBlock
                : [
                    styles.titleInline,
                    selected && styles.titleInlineSelected,
                    disabled && styles.titleInlineDisabled,
                  ],
            ],
            ctx.classNames.title,
            ctx.styles.title,
          )}
          onClick={ctx.blockNode ? undefined : select}
        >
          {ctx.titleRender ? ctx.titleRender(node) : node.title}
        </span>
      </div>
      {expandable && (
        <Collapsible.Root open={expanded}>
          <Collapsible.Panel className={stylex.props(styles.panel).className}>
            {node.children!.map((child, i) => (
              <TreeNode
                depth={depth + 1}
                isLast={i === node.children!.length - 1}
                key={child.key}
                node={child}
                trail={[...trail, !isLast]}
              />
            ))}
          </Collapsible.Panel>
        </Collapsible.Root>
      )}
    </>
  );
});

TreeNode.displayName = 'TreeNode';

export default TreeNode;
