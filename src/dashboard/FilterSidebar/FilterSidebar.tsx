'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';

import Button from '@/base-ui/Button';
import { DraggablePanel } from '@/base-ui/DraggablePanel';
import { Drawer } from '@/base-ui/Drawer';

import { useIsCompact, useLocalStorage } from '../hooks';
import { styles as surfaceStyles } from '../Surface/style';
import { FilterSplitProvider } from './context';
import { styles } from './style';
import type { FilterOptionProps, FilterRowProps, FilterSidebarProps } from './type';
import { clampSidebarWidth, sidebarWidth } from './width';

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
        <div className={styles.layout}>
          {header}
          <Button block icon={Filter} onClick={() => setDrawerOpen(true)}>
            {summary}
          </Button>
          <Drawer open={drawerOpen} placement="left" title={label} width={300} onClose={close}>
            <div className={styles.drawerPanel}>
              {head?.(close)}
              {body(close)}
            </div>
          </Drawer>
          <div className={styles.content}>{children}</div>
        </div>
      </FilterSplitProvider>
    );
  }

  return (
    <FilterSplitProvider active={!flush}>
      <div
        className={flush ? styles.layout : `${styles.layout} ${surfaceStyles.card}`}
        data-flush={flush ? true : undefined}
        data-page-layout={flush ? 'flush' : undefined}
        data-split-card={flush ? undefined : true}
      >
        <DraggablePanel
          expandable
          showHandleWhenCollapsed
          aria-label={label}
          className={styles.sidebar}
          classNames={{ content: styles.panel }}
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
          onExpandChange={sidebar.onExpandChange}
          onSizeChange={(_delta, size) => sidebar.onSizeChange(size)}
        >
          {head ? <div className={styles.head}>{head(close)}</div> : null}
          <div className={styles.body} data-flush={flush ? true : undefined}>
            {body(close)}
          </div>
        </DraggablePanel>
        <div className={styles.content} data-flush={flush ? true : undefined}>
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
    <span className={styles.row}>
      <span className={styles.name}>{name}</span>
      {count !== undefined ? <span className={styles.count}>{count}</span> : null}
    </span>
  );
}

FilterRow.displayName = 'FilterRow';

function FilterOption({ count, icon, label, name, onClick, selected, title }: FilterOptionProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={selected}
      className={styles.option}
      title={title}
      type="button"
      onClick={onClick}
    >
      {icon}
      <span className={styles.name}>{name}</span>
      {count !== undefined ? <span className={styles.count}>{count}</span> : null}
    </button>
  );
}

FilterOption.displayName = 'FilterOption';

export { FilterOption, FilterRow };
export default FilterSidebar;
