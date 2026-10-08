'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import { Filter } from 'lucide-react';
import { useState } from 'react';

import Button from '@/Button';
import { DraggablePanel } from '@/DraggablePanel';
import { Drawer } from '@/Drawer';
import { styleProps } from '@/styles/stylex/props';

import { useIsCompact, useLocalStorage } from '../hooks';
import { styles as surfaceStyles } from '../Surface/style';
import { FilterSplitProvider } from './context';
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
  flush,
  head,
  header,
  label,
  storageKey,
  summary,
  wide,
}: FilterSidebarProps) {
  const isCompact = useIsCompact();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sidebar = usePageSidebar(wide, storageKey);
  const close = () => setDrawerOpen(false);

  if (isCompact) {
    return (
      <FilterSplitProvider active={!flush}>
        <div {...stylex.props(styles.layout)}>
          {header}
          <Button block icon={Filter} onClick={() => setDrawerOpen(true)}>
            {summary}
          </Button>
          <Drawer open={drawerOpen} placement="left" title={label} width={300} onClose={close}>
            <div {...stylex.props(styles.drawerPanel)}>
              {head?.(close)}
              {body(close)}
            </div>
          </Drawer>
          <div {...styleProps(styles.content, contentClassName)}>{children}</div>
        </div>
      </FilterSplitProvider>
    );
  }

  return (
    <FilterSplitProvider active={!flush}>
      <div
        {...stylex.props(
          styles.layout,
          flush ? styles.layoutFlush : [surfaceStyles.card, styles.layoutSplit],
        )}
        data-flush={flush ? true : undefined}
        data-page-layout={flush ? 'flush' : undefined}
        data-split-card={flush ? undefined : true}
      >
        <DraggablePanel
          expandable
          showHandleWhenCollapsed
          aria-label={label}
          className={stylex.props(styles.sidebar, flush && styles.sidebarFlush).className}
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
          classNames={{
            content: stylex.props(styles.panel, !flush && styles.panelSplit).className,
          }}
          onExpandChange={sidebar.onExpandChange}
          onSizeChange={(_delta, size) => sidebar.onSizeChange(size)}
        >
          {head ? <div {...stylex.props(styles.head)}>{head(close)}</div> : null}
          <div
            data-flush={flush ? true : undefined}
            {...stylex.props(styles.body, flush && styles.bodyFlush)}
          >
            {body(close)}
          </div>
        </DraggablePanel>
        <div
          data-flush={flush ? true : undefined}
          {...styleProps(
            [styles.content, flush ? styles.contentFlush : styles.contentSplit],
            contentClassName,
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

function FilterRow({ count, name }: FilterRowProps) {
  return (
    <span {...stylex.props(styles.row)}>
      <span {...stylex.props(styles.name)}>{name}</span>
      {count !== undefined ? <span {...stylex.props(styles.count)}>{count}</span> : null}
    </span>
  );
}

FilterRow.displayName = 'FilterRow';

function FilterOption({ count, icon, label, name, onClick, selected, title }: FilterOptionProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={selected}
      title={title}
      type="button"
      onClick={onClick}
      {...stylex.props(styles.option)}
    >
      {icon}
      <span {...stylex.props(styles.name)}>{name}</span>
      {count !== undefined ? <span {...stylex.props(styles.count)}>{count}</span> : null}
    </button>
  );
}

FilterOption.displayName = 'FilterOption';

export { FilterOption, FilterRow };
export default FilterSidebar;
