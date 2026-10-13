'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cx } from 'antd-style';
import { ListFilter, Search } from 'lucide-react';
import {
  createContext,
  type Key,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import Button from '@/base-ui/Button';
import { Checkbox } from '@/base-ui/Checkbox';
import { Input } from '@/base-ui/Input';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/base-ui/Popover';
import { Radio } from '@/base-ui/Radio';
import Tree, { conductCheck, getAllKeys, type TreeDataNode } from '@/base-ui/Tree';
import Empty from '@/Empty';
import Icon from '@/Icon';

import { PREFIX_CLS, styles } from './style';
import type {
  TableColumnFilterItem,
  TableColumnType,
  TableFilterDropdownProps,
  TableLocale,
} from './type';
import { type FilterKeys, type FilterState, flattenFilterKeys } from './useFilter';

const FILTER_CLS = `${PREFIX_CLS}-filter`;

/** True inside rc-table's hidden measure row, where only a static trigger is rendered. */
export const TableMeasureRowContext = createContext(false);

const sameKeys = (a: readonly Key[] | null | undefined, b: readonly Key[] | null | undefined) =>
  (a ?? null) === (b ?? null) ||
  (Boolean(a) && Boolean(b) && a!.length === b!.length && a!.every((key, i) => key === b![i]));

const textMatches = (search: string, text: ReactNode) =>
  (typeof text === 'string' || typeof text === 'number') &&
  String(text).toLowerCase().includes(search);

const DEPRECATED_PROPS = [
  ['filterDropdownOpen', 'filterDropdownProps.open'],
  ['onFilterDropdownOpenChange', 'filterDropdownProps.onOpenChange'],
] as const;
const warnedProps = new Set<string>();

/** Warns once per deprecated column prop, in development (antd `warning.deprecated`). */
const warnDeprecated = (column: object) => {
  if (process.env.NODE_ENV === 'production') return;
  for (const [name, replacement] of DEPRECATED_PROPS) {
    if (name in column && !warnedProps.has(name)) {
      warnedProps.add(name);
      console.warn(`[Table] \`${name}\` is deprecated. Please use \`${replacement}\` instead.`);
    }
  }
};

/** Keys of `key` and its descendants, plus the keys of its ancestors. */
const findLineage = (
  nodes: readonly TreeDataNode[],
  key: string,
  ancestors: string[] = [],
): { ancestors: string[]; subtree: string[] } | undefined => {
  for (const node of nodes) {
    if (node.key === key) return { ancestors, subtree: getAllKeys([node]) };
    const found = node.children && findLineage(node.children, key, [...ancestors, node.key]);
    if (found) return found;
  }
};

/** Draft keys that re-render on write and can be read synchronously (antd `useSyncState`). */
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
    filterMode = 'menu',
    filterMultiple = true,
    filterOnClose = true,
    filterResetToDefaultFilteredValue,
    filters,
    filterSearch = false,
    onFilterDropdownOpenChange,
  } = column;

  const inMeasureRow = use(TableMeasureRowContext);
  warnDeprecated(column);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const normalizedSearch = searchValue.trim().toLowerCase();
  const mergedVisible = filterDropdownProps.open ?? filterDropdownOpen ?? visible;
  const filtered = Boolean(filterState?.filteredKeys?.length || filterState?.forceFiltered);

  const triggerOpen = (next: boolean) => {
    setVisible(next);
    // The search box starts empty every time the panel opens.
    setSearchValue('');
    filterDropdownProps.onOpenChange?.(next);
    onFilterDropdownOpenChange?.(next);
  };

  // ============================ Draft keys ============================
  // Booleans only come from `filteredValue`; the panel works with keys, like antd.
  const propFilteredKeys = filterState?.filteredKeys as Key[] | null | undefined;
  const [getSelectedKeys, setSelectedKeys] = useSyncKeys(propFilteredKeys ?? []);

  useEffect(() => {
    if (mergedVisible) setSelectedKeys(propFilteredKeys ?? []);
    // `setSelectedKeys` is stable in behavior; re-sync only on open / applied-keys change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propFilteredKeys, mergedVisible]);

  // ============================== Submit ==============================
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

  /** Opening / closing from the trigger, an outside press or Escape. */
  const onPopoverOpenChange = (next: boolean) => {
    if (next && propFilteredKeys !== undefined) setSelectedKeys(propFilteredKeys ?? []);
    if (!next && !filterDropdown && filterOnClose) onConfirm();
    else triggerOpen(next);
  };

  // ============================== Content =============================
  const selectedKeys = getSelectedKeys();
  const selectedSet = new Set(selectedKeys.map(String));
  const allKeys = useMemo(() => flattenFilterKeys(filters).map(String), [filters]);

  const matches = (item: TableColumnFilterItem) =>
    typeof filterSearch === 'function'
      ? filterSearch(normalizedSearch, item)
      : textMatches(normalizedSearch, item.text);

  const toggleKey = (key: string, checked: boolean) => {
    if (!filterMultiple) return setSelectedKeys(checked ? [key] : []);
    const rest = selectedKeys.filter((item) => String(item) !== key);
    setSelectedKeys(checked ? [...rest, key] : rest);
  };

  const renderMenuItems = (items: readonly TableColumnFilterItem[]): ReactNode[] =>
    items.flatMap((item, index) => {
      const key = String(item.value);
      if (item.children) {
        const children = renderMenuItems(item.children);
        if (children.length === 0) return [];
        return [
          <div className={styles.filterGroup} key={key || index} role="group">
            <div className={cx(styles.filterGroupTitle, `${FILTER_CLS}-dropdown-submenu-title`)}>
              {item.text}
            </div>
            {children}
          </div>,
        ];
      }
      if (normalizedSearch && !matches(item)) return [];
      return [
        <div className={cx(styles.filterItem, `${FILTER_CLS}-dropdown-item`)} key={key}>
          {filterMultiple ? (
            <Checkbox
              checked={selectedSet.has(key)}
              onChange={(checked) => toggleKey(key, checked)}
            >
              {item.text}
            </Checkbox>
          ) : (
            <Radio value={key}>{item.text}</Radio>
          )}
        </div>,
      ];
    });

  const toTreeData = (
    items: readonly TableColumnFilterItem[] | undefined,
    ancestorMatched = false,
  ): TreeDataNode[] =>
    (items ?? []).flatMap((item, index) => {
      const selfMatched = ancestorMatched || !normalizedSearch || matches(item);
      const children = item.children ? toTreeData(item.children, selfMatched) : undefined;
      if (!selfMatched && !children?.length) return [];
      return [
        {
          children,
          key: item.value !== undefined ? String(item.value) : String(index),
          title: item.text,
        },
      ];
    });

  const renderSearch = () =>
    filterSearch ? (
      <div className={cx(styles.filterSearch, `${PREFIX_CLS}-filter-dropdown-search`)}>
        <Input
          allowClear
          placeholder={locale.filterSearchPlaceholder}
          prefix={<Icon icon={Search} size={14} />}
          size="small"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
    ) : null;

  const empty = (
    <Empty className={styles.filterEmpty} description={locale.filterEmptyText} imageSize={24} />
  );

  let content: ReactNode;
  if (typeof filterDropdown === 'function') {
    content = filterDropdown({
      clearFilters: onReset,
      close: () => triggerOpen(false),
      confirm: doFilter,
      filters,
      prefixCls: `${FILTER_CLS}-dropdown-custom`,
      selectedKeys,
      setSelectedKeys,
      visible: mergedVisible,
    });
  } else if (filterDropdown !== undefined) {
    content = filterDropdown;
  } else {
    let body: ReactNode;
    if (!filters?.length) {
      body = empty;
    } else if (filterMode === 'tree') {
      const treeData = toTreeData(filters);
      // Searching prunes the tree, so cascade checks on the full tree and show the keys as is.
      const fullTreeData = normalizedSearch ? toTreeData(filters, true) : treeData;
      const onTreeCheck = (checked: boolean, node: TreeDataNode) => {
        if (!filterMultiple) return setSelectedKeys(checked ? [node.key] : []);
        const lineage = findLineage(fullTreeData, node.key);
        const base = conductCheck(fullTreeData, selectedKeys.map(String)).checked;
        if (checked) lineage?.subtree.forEach((key) => base.add(key));
        else
          [...(lineage?.subtree ?? []), ...(lineage?.ancestors ?? [])].forEach((key) =>
            base.delete(key),
          );
        setSelectedKeys([...conductCheck(fullTreeData, base).checked]);
      };
      body = (
        <>
          {renderSearch()}
          <div className={cx(styles.filterTree, `${PREFIX_CLS}-filter-dropdown-tree`)}>
            {filterMultiple && (
              <Checkbox
                checked={selectedKeys.length > 0 && selectedKeys.length === allKeys.length}
                className={cx(styles.filterCheckAll, `${PREFIX_CLS}-filter-dropdown-checkall`)}
                indeterminate={selectedKeys.length > 0 && selectedKeys.length < allKeys.length}
                onChange={(checked) => setSelectedKeys(checked ? allKeys : [])}
              >
                {locale.filterCheckAll}
              </Checkbox>
            )}
            {treeData.length > 0 ? (
              <Tree
                checkable
                defaultExpandAll
                checkStrictly={!filterMultiple || Boolean(normalizedSearch)}
                checkedKeys={selectedKeys.map(String)}
                multiple={filterMultiple}
                selectedKeys={[]}
                size="small"
                treeData={treeData}
                onCheck={(_, { checked, node }) => onTreeCheck(checked, node)}
              />
            ) : (
              empty
            )}
          </div>
        </>
      );
    } else {
      const items = renderMenuItems(filters);
      const list = (
        <div className={cx(styles.filterMenu, `${FILTER_CLS}-dropdown-menu`)}>{items}</div>
      );
      body = (
        <>
          {renderSearch()}
          {items.length === 0 ? (
            empty
          ) : filterMultiple ? (
            list
          ) : (
            <BaseRadioGroup
              value={selectedKeys.length ? String(selectedKeys[0]) : null}
              onValueChange={(value) => setSelectedKeys(value == null ? [] : [String(value)])}
            >
              {list}
            </BaseRadioGroup>
          )}
        </>
      );
    }

    const resetDisabled = filterResetToDefaultFilteredValue
      ? sameKeys((defaultFilteredValue ?? []).map(String), selectedKeys.map(String))
      : selectedKeys.length === 0;

    content = (
      <>
        {body}
        <div className={cx(styles.filterButtons, `${FILTER_CLS}-dropdown-btns`)}>
          <Button disabled={resetDisabled} size="small" type="link" onClick={() => onReset()}>
            {locale.filterReset}
          </Button>
          <Button size="small" type="primary" onClick={onConfirm}>
            {locale.filterConfirm}
          </Button>
        </div>
      </>
    );
  }

  const popupRender = filterDropdownProps.popupRender ?? filterDropdownProps.dropdownRender;
  const panel = (
    <div className={cx(styles.filterDropdown, `${FILTER_CLS}-dropdown`)}>
      {popupRender ? popupRender(content) : content}
    </div>
  );

  // ============================== Trigger =============================
  const icon =
    typeof filterIcon === 'function'
      ? filterIcon(filtered)
      : (filterIcon ?? <Icon icon={ListFilter} size={12} />);

  const trigger = (
    <button
      aria-label={`Filter ${label}`}
      className={cx(styles.filterButton, `${FILTER_CLS}-trigger`, filtered && styles.filterActive)}
      data-active={filtered || undefined}
      ref={triggerRef}
      title={locale.filterTitle}
      type="button"
      onClick={(event) => event.stopPropagation()}
    >
      {icon}
    </button>
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
            className={cx(styles.filterPopup, filterDropdownProps.className)}
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
