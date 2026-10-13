'use client';

import clsx from 'clsx';
import { ListFilter } from 'lucide-react';
import { type Key, type ReactNode, use, useEffect, useReducer, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/Popover';

import { type FilterKeys, type FilterState } from '../pipeline/useFilter';
import { styles } from '../style';
import type { TableColumnType, TableFilterDropdownProps, TableLocale } from '../type';
import { MeasureRowContext } from './context';
import FilterPanel from './FilterPanel';
import { FILTER_CLS, sameKeys, sx } from './filterUtils';

const DEPRECATED_PROPS = [
  ['filterDropdownOpen', 'filterDropdownProps.open'],
  ['onFilterDropdownOpenChange', 'filterDropdownProps.onOpenChange'],
] as const;
const warnedProps = new Set<string>();

const warnDeprecated = (column: object) => {
  if (process.env.NODE_ENV === 'production') return;
  for (const [name, replacement] of DEPRECATED_PROPS) {
    if (name in column && !warnedProps.has(name)) {
      warnedProps.add(name);
      console.warn(`[Table] \`${name}\` is deprecated. Please use \`${replacement}\` instead.`);
    }
  }
};

const useSyncKeys = (initial: Key[]) => {
  const ref = useRef(initial);
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  return [
    () => ref.current,
    (next: Key[]) => {
      ref.current = next;
      rerender();
    },
  ] as const;
};

interface FilterDropdownProps<T> {
  column: TableColumnType<T>;
  columnKey: string;
  filterState?: FilterState<T>;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  label: string;
  locale: Pick<
    TableLocale,
    | 'filterCheckAll'
    | 'filterConfirm'
    | 'filterEmptyText'
    | 'filterReset'
    | 'filterSearchPlaceholder'
    | 'filterTitle'
  >;
  triggerFilter: (columnKey: string, filteredKeys: FilterKeys) => void;
}

const FilterDropdown = <T,>({
  column,
  columnKey,
  filterState,
  getPopupContainer,
  label,
  locale,
  triggerFilter,
}: FilterDropdownProps<T>) => {
  const {
    defaultFilteredValue,
    filterDropdown,
    filterDropdownOpen,
    filterDropdownProps = {},
    filterIcon,
    filterOnClose = true,
    filterResetToDefaultFilteredValue,
    filters,
    onFilterDropdownOpenChange,
  } = column;

  const inMeasureRow = use(MeasureRowContext);
  warnDeprecated(column);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const mergedVisible = filterDropdownProps.open ?? filterDropdownOpen ?? visible;
  const filtered = Boolean(filterState?.filteredKeys?.length || filterState?.forceFiltered);

  const triggerOpen = (next: boolean) => {
    setVisible(next);
    // The search box starts empty every time the panel opens.
    setSearchValue('');
    filterDropdownProps.onOpenChange?.(next);
    onFilterDropdownOpenChange?.(next);
  };

  // Booleans only come from `filteredValue`; the panel works with keys, like antd.
  const propFilteredKeys = filterState?.filteredKeys as Key[] | null | undefined;
  const [getSelectedKeys, setSelectedKeys] = useSyncKeys(propFilteredKeys ?? []);

  useEffect(() => {
    if (mergedVisible) setSelectedKeys(propFilteredKeys ?? []);
    // `setSelectedKeys` is stable in behavior; re-sync only on open / applied-keys change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propFilteredKeys, mergedVisible]);

  const internalTriggerFilter = (keys: Key[] | null) => {
    const mergedKeys = keys?.length ? keys : null;
    if (mergedKeys === null && !propFilteredKeys) return;
    if (sameKeys(mergedKeys, propFilteredKeys)) return;
    triggerFilter(columnKey, mergedKeys);
  };

  const onConfirm = () => {
    triggerOpen(false);
    internalTriggerFilter(getSelectedKeys());
  };

  const onReset: NonNullable<TableFilterDropdownProps['clearFilters']> = ({
    closeDropdown = false,
    confirm = false,
  } = {}) => {
    if (confirm) internalTriggerFilter([]);
    if (closeDropdown) triggerOpen(false);
    setSearchValue('');
    setSelectedKeys(
      filterResetToDefaultFilteredValue ? (defaultFilteredValue ?? []).map(String) : [],
    );
  };

  const doFilter: TableFilterDropdownProps['confirm'] = ({ closeDropdown = true } = {}) => {
    if (closeDropdown) triggerOpen(false);
    internalTriggerFilter(getSelectedKeys());
  };

  const onPopoverOpenChange = (next: boolean) => {
    if (next && propFilteredKeys !== undefined) setSelectedKeys(propFilteredKeys ?? []);
    if (!next && !filterDropdown && filterOnClose) onConfirm();
    else triggerOpen(next);
  };

  let content: ReactNode;
  if (typeof filterDropdown === 'function') {
    content = filterDropdown({
      clearFilters: onReset,
      close: () => triggerOpen(false),
      confirm: doFilter,
      filters,
      prefixCls: `${FILTER_CLS}-dropdown-custom`,
      selectedKeys: getSelectedKeys(),
      setSelectedKeys,
      visible: mergedVisible,
    });
  } else if (filterDropdown !== undefined) {
    content = filterDropdown;
  } else {
    content = (
      <FilterPanel
        column={column}
        locale={locale}
        searchValue={searchValue}
        selectedKeys={getSelectedKeys()}
        setSelectedKeys={setSelectedKeys}
        onConfirm={onConfirm}
        onReset={() => onReset()}
        onSearchChange={setSearchValue}
      />
    );
  }

  const popupRender = filterDropdownProps.popupRender ?? filterDropdownProps.dropdownRender;
  const panel = (
    <div className={clsx(sx(styles.filterDropdown), `${FILTER_CLS}-dropdown`)}>
      {popupRender ? popupRender(content) : content}
    </div>
  );

  const icon = typeof filterIcon === 'function' ? filterIcon(filtered) : (filterIcon ?? ListFilter);

  // Native `title` would need ActionIcon's tooltip, which can't sit inside the popover trigger;
  // the localized hint rides on `aria-description` instead.
  const trigger = (
    <ActionIcon
      active={filtered}
      aria-description={locale.filterTitle}
      aria-label={`Filter ${label}`}
      data-active={filtered || undefined}
      icon={icon}
      ref={triggerRef}
      size="small"
      className={clsx(
        sx(styles.filterButton),
        `${FILTER_CLS}-trigger`,
        filtered && sx(styles.filterActive),
      )}
      onClick={(event) => event.stopPropagation()}
    />
  );

  if (inMeasureRow) return trigger;

  const resolveContainer = filterDropdownProps.getPopupContainer ?? getPopupContainer;
  const container =
    mergedVisible && resolveContainer && triggerRef.current
      ? resolveContainer(triggerRef.current)
      : undefined;

  return (
    <PopoverRoot open={mergedVisible} onOpenChange={onPopoverOpenChange}>
      <PopoverTriggerElement>{trigger}</PopoverTriggerElement>
      <PopoverPortal container={container}>
        <PopoverPositioner
          className={filterDropdownProps.rootClassName}
          placement={filterDropdownProps.placement ?? 'bottomRight'}
          sideOffset={4}
          style={
            filterDropdownProps.zIndex === undefined
              ? undefined
              : { zIndex: filterDropdownProps.zIndex }
          }
        >
          <PopoverPopup
            className={clsx(sx(styles.filterPopup), filterDropdownProps.className)}
            style={filterDropdownProps.style}
          >
            {panel}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  );
};

export default FilterDropdown;
