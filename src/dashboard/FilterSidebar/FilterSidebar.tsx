'use client';

import './style.css';

import clsx from 'clsx';
import { Filter } from 'lucide-react';
import { useState } from 'react';

import Button from '@/Button';
import { DraggablePanel } from '@/DraggablePanel';
import { Drawer } from '@/Drawer';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useIsCompact, useLocalStorage } from '../hooks';
import { useSurfaceCardStyles } from '../Surface/link';
import { FilterSplitProvider } from './context';
import {
  dashboardFilterOptionClasses,
  dashboardFilterRowClasses,
  dashboardFilterSidebarClasses,
} from './stable';
import { styles } from './style';
import type { FilterOptionProps, FilterRowProps, FilterSidebarProps } from './type';
import { clampSidebarWidth, sidebarWidth } from './width';

const contentClassName = 'lobe-filter-sidebar-content';

function usePageSidebar(wide: boolean | undefined, storageKey: string | undefined) {
  const fallback = wide ? sidebarWidth.wide : sidebarWidth.narrow;
  const [prefs, setPrefs] = useLocalStorage<{ expand?: boolean; width?: number }>(storageKey, {
    expand: true,
    width: fallback,
  });
  return {
    expand: prefs.expand !== false,
    onExpandChange: (expand: boolean) => setPrefs((current) => ({ ...current, expand })),
    onSizeChange: (size: { width?: number | string }) => {
      const next = typeof size.width === 'number' ? size.width : fallback;
      setPrefs((current) => ({ ...current, width: clampSidebarWidth(next, fallback) }));
    },
    width: clampSidebarWidth(Number(prefs.width), fallback),
  };
}

function FilterSidebar({
  body,
  children,
  className,
  flush,
  head,
  header,
  label,
  storageKey,
  summary,
  wide,
}: FilterSidebarProps) {
  const cardStyles = useSurfaceCardStyles();
  const isCompact = useIsCompact();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sidebar = usePageSidebar(wide, storageKey);
  const close = () => setDrawerOpen(false);

  if (isCompact) {
    return (
      <FilterSplitProvider active={!flush}>
        <div
          {...styleProps(styles.layout, clsx(dashboardFilterSidebarClasses(), className))}
          data-flush={flush ? true : undefined}
          {...toDataAttributes({ compact: true })}
        >
          {header}
          <Button
            block
            className={dashboardFilterSidebarClasses('toggle')}
            icon={Filter}
            onClick={() => setDrawerOpen(true)}
          >
            {summary}
          </Button>
          <Drawer open={drawerOpen} placement="left" title={label} width={300} onClose={close}>
            <div {...styleProps(styles.drawerPanel, dashboardFilterSidebarClasses('drawer-panel'))}>
              {head?.(close)}
              {body(close)}
            </div>
          </Drawer>
          <div
            {...styleProps(
              styles.content,
              clsx(dashboardFilterSidebarClasses('content'), contentClassName),
            )}
          >
            {children}
          </div>
        </div>
      </FilterSplitProvider>
    );
  }

  return (
    <FilterSplitProvider active={!flush}>
      <div
        {...styleProps(
          [styles.layout, flush ? styles.layoutFlush : [cardStyles, styles.layoutSplit]],
          clsx(dashboardFilterSidebarClasses(), className),
        )}
        data-flush={flush ? true : undefined}
        data-page-layout={flush ? 'flush' : undefined}
        data-split-card={flush ? undefined : true}
      >
        <DraggablePanel
          expandable
          showHandleWhenCollapsed
          aria-label={label}
          collapseThreshold={sidebarWidth.collapse}
          data-flush={flush ? true : undefined}
          defaultSize={{ width: wide ? sidebarWidth.wide : sidebarWidth.narrow }}
          expand={sidebar.expand}
          maxWidth={sidebarWidth.max}
          minWidth={sidebarWidth.min}
          mode="fixed"
          placement="left"
          showBorder={false}
          size={{ width: sidebar.width }}
          className={
            styleProps(
              [styles.sidebar, flush && styles.sidebarFlush],
              dashboardFilterSidebarClasses('sidebar'),
            ).className
          }
          classNames={{
            content: styleProps(
              [styles.panel, !flush && styles.panelSplit],
              dashboardFilterSidebarClasses('panel'),
            ).className,
          }}
          onExpandChange={sidebar.onExpandChange}
          onSizeChange={(_delta, size) => sidebar.onSizeChange(size)}
        >
          {head ? (
            <div {...styleProps(styles.head, dashboardFilterSidebarClasses('head'))}>
              {head(close)}
            </div>
          ) : null}
          <div
            data-flush={flush ? true : undefined}
            {...styleProps(
              [styles.body, flush && styles.bodyFlush],
              dashboardFilterSidebarClasses('body'),
            )}
          >
            {body(close)}
          </div>
        </DraggablePanel>
        <div
          data-flush={flush ? true : undefined}
          {...styleProps(
            [styles.content, flush ? styles.contentFlush : styles.contentSplit],
            clsx(dashboardFilterSidebarClasses('content'), contentClassName),
          )}
        >
          {header}
          {children}
        </div>
      </div>
    </FilterSplitProvider>
  );
}

FilterSidebar.displayName = 'FilterSidebar';

function FilterRow({ className, count, name }: FilterRowProps) {
  return (
    <span {...styleProps(styles.row, clsx(dashboardFilterRowClasses(), className))}>
      <span {...styleProps(styles.name, dashboardFilterRowClasses('name'))}>{name}</span>
      {count !== undefined ? (
        <span {...styleProps(styles.count, dashboardFilterRowClasses('count'))}>{count}</span>
      ) : null}
    </span>
  );
}

FilterRow.displayName = 'FilterRow';

function FilterOption({
  className,
  count,
  icon,
  label,
  name,
  onClick,
  selected,
  title,
}: FilterOptionProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={selected}
      title={title}
      type="button"
      onClick={onClick}
      {...styleProps(styles.option, clsx(dashboardFilterOptionClasses(), className))}
      {...toDataAttributes({ selected })}
    >
      {icon}
      <span {...styleProps(styles.name, dashboardFilterOptionClasses('name'))}>{name}</span>
      {count !== undefined ? (
        <span {...styleProps(styles.count, dashboardFilterOptionClasses('count'))}>{count}</span>
      ) : null}
    </button>
  );
}

FilterOption.displayName = 'FilterOption';

export { FilterOption, FilterRow };
export default FilterSidebar;
