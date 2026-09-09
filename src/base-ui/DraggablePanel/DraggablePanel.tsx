'use client';

import { cx } from 'antd-style';
import { memo, useCallback } from 'react';

import {
  DraggablePanelContent,
  DraggablePanelHandle,
  DraggablePanelRoot,
  DraggablePanelToggle,
} from './atoms';
import { AXES } from './core/axes';
import type { DraggablePanelProps, DraggablePanelSize } from './type';

const toNumber = (value: number | string | undefined) =>
  typeof value === 'number' ? Math.max(value, 0) : undefined;

const DraggablePanel = memo<DraggablePanelProps>(
  ({
    backgroundColor,
    children,
    className,
    classNames,
    collapseThreshold,
    defaultExpand,
    defaultSize,
    expand,
    expandable = true,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    mode = 'fixed',
    onExpandChange,
    onSizeChange,
    onSizeDragging,
    placement = 'right',
    showBorder = true,
    showHandleWhenCollapsed,
    showHandleWideArea = true,
    size,
    styles: customStyles,
    ...rest
  }) => {
    const { vertical } = AXES[placement];

    const toSize = useCallback(
      (value: number): DraggablePanelSize =>
        vertical ? { height: value, width: '100%' } : { height: '100%', width: value },
      [vertical],
    );
    const toDelta = useCallback(
      (value: number): DraggablePanelSize =>
        vertical ? { height: value, width: 0 } : { height: 0, width: value },
      [vertical],
    );

    const handleSizeChange = useCallback(
      (next: number, delta: number) => onSizeChange?.(toDelta(delta), toSize(next)),
      [onSizeChange, toDelta, toSize],
    );
    const handleSizeDragging = useCallback(
      (next: number, delta: number) => onSizeDragging?.(toDelta(delta), toSize(next)),
      [onSizeDragging, toDelta, toSize],
    );

    return (
      <DraggablePanelRoot
        backgroundColor={backgroundColor}
        className={className}
        collapseThreshold={collapseThreshold}
        defaultExpand={defaultExpand}
        defaultSize={toNumber(vertical ? defaultSize?.height : defaultSize?.width)}
        expand={expand}
        expandable={expandable}
        max={toNumber(vertical ? maxHeight : maxWidth)}
        min={toNumber(vertical ? minHeight : minWidth) ?? 0}
        mode={mode}
        placement={placement}
        showBorder={showBorder}
        size={toNumber(vertical ? size?.height : size?.width)}
        onExpandChange={onExpandChange}
        onSizeChange={handleSizeChange}
        onSizeDragging={handleSizeDragging}
        {...rest}
      >
        <DraggablePanelToggle showHandleWhenCollapsed={showHandleWhenCollapsed} />
        <DraggablePanelContent className={cx(classNames?.content)} style={customStyles?.content}>
          {children}
        </DraggablePanelContent>
        <DraggablePanelHandle wideArea={showHandleWideArea} />
      </DraggablePanelRoot>
    );
  },
);

DraggablePanel.displayName = 'DraggablePanel';

export default DraggablePanel;
