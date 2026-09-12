'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { cx } from 'antd-style';
import { ChevronRight, File, Folder } from 'lucide-react';
import { type CSSProperties, memo, type MouseEvent } from 'react';

import { Checkbox } from '@/base-ui/Checkbox';
import { controlHeight } from '@/base-ui/controlSize';
import Icon from '@/Icon';

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

const guidePath = (depth: number, isLast: boolean, trail: boolean[], indent: number, height: number) => {
  const cx = (i: number) => i * indent + SWITCHER_CENTER;
  let d = '';
  trail.forEach((more, i) => {
    if (more) d += `M${cx(i)} 0V${height}`;
  });
  const x = cx(depth - 1);
  const y = height / 2;
  const elbow = `M${x} ${y - ARC}A${ARC} ${ARC} 0 0 0 ${x + ARC} ${y}H${x + indent - 2}`;
  d += isLast ? `M${x} 0V${y - ARC}${elbow.slice(elbow.indexOf('A'))}` : `M${x} 0V${height}${elbow}`;
  return d;
};

const TreeNode = memo<TreeNodeProps>(({ node, depth, isLast, trail }) => {
  const ctx = useTreeContext();
  const expandable = isExpandable(node);
  const expanded = expandable && ctx.expanded.has(node.key);
  const disabled = ctx.disabled || !!node.disabled;
  const checkable = ctx.checkable && node.checkable !== false;
  const checkState = ctx.checked.has(node.key)
    ? 'checked'
    : ctx.halfChecked.has(node.key)
      ? 'mixed'
      : 'unchecked';
  const rowHeight = controlHeight[ctx.size];

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
        aria-checked={checkable ? (checkState === 'mixed' ? 'mixed' : checkState === 'checked') : undefined}
        aria-disabled={disabled || undefined}
        aria-expanded={expandable ? expanded : undefined}
        aria-level={depth + 1}
        aria-selected={ctx.selected.has(node.key)}
        ref={(el) => ctx.registerRow(node.key, el)}
        role="treeitem"
        style={rowStyle}
        tabIndex={ctx.activeKey === node.key ? 0 : -1}
        className={cx(
          styles.node,
          ctx.blockNode && styles.nodeBlock,
          disabled && styles.nodeDisabled,
          ctx.classNames.node,
        )}
        onClick={ctx.blockNode ? select : undefined}
        onContextMenu={(event) => ctx.onRightClick(event, node)}
        onFocus={() => ctx.setActiveKey(node.key)}
      >
        {ctx.showLine && depth > 0 && (
          <svg
            aria-hidden
            className={cx(styles.guide, ctx.classNames.guide)}
            height={rowHeight}
            style={ctx.styles.guide}
            width={depth * ctx.indent}
          >
            <path d={guidePath(depth, isLast, trail, ctx.indent, rowHeight)} />
          </svg>
        )}
        <button
          aria-hidden
          className={cx(styles.switcher, !expandable && styles.switcherLeaf, ctx.classNames.switcher)}
          style={ctx.styles.switcher}
          tabIndex={-1}
          type="button"
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
            className={styles.checkbox}
            disabled={disabled}
            indeterminate={checkState === 'mixed'}
            onChange={() => ctx.toggleCheck(node)}
            onClick={(event) => event.stopPropagation()}
          />
        )}
        {ctx.showIcon && (
          <span className={styles.icon}>
            {node.icon ?? <Icon icon={expandable ? Folder : File} size={16} />}
          </span>
        )}
        <span
          style={ctx.styles.title}
          className={cx(
            styles.title,
            ctx.blockNode ? styles.titleBlock : styles.titleInline,
            ctx.classNames.title,
          )}
          onClick={ctx.blockNode ? undefined : select}
        >
          {ctx.titleRender ? ctx.titleRender(node) : node.title}
        </span>
      </div>
      {expandable && (
        <Collapsible.Root open={expanded}>
          <Collapsible.Panel className={styles.panel}>
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
