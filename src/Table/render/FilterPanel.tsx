'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { type Key, type ReactNode, useMemo } from 'react';

import Button from '@/Button';
import { Checkbox } from '@/Checkbox';
import Empty from '@/Empty';
import Icon from '@/Icon';
import { Input } from '@/Input';
import { Radio } from '@/Radio';
import Tree, { conductCheck, type TreeDataNode } from '@/Tree';

import { PREFIX_CLS } from '../constants';
import { flattenFilterKeys } from '../pipeline/useFilter';
import { styles } from '../style';
import type { TableColumnFilterItem, TableColumnType, TableLocale } from '../type';
import { FILTER_CLS, findLineage, sameKeys, sx, textMatches } from './filterUtils';

export interface FilterPanelProps<T> {
  column: TableColumnType<T>;
  locale: Pick<
    TableLocale,
    | 'filterCheckAll'
    | 'filterConfirm'
    | 'filterEmptyText'
    | 'filterReset'
    | 'filterSearchPlaceholder'
  >;
  onConfirm: () => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
  selectedKeys: Key[];
  setSelectedKeys: (keys: Key[]) => void;
}

const FilterPanel = <T,>({
  column,
  locale,
  onConfirm,
  onReset,
  onSearchChange,
  searchValue,
  selectedKeys,
  setSelectedKeys,
}: FilterPanelProps<T>) => {
  const {
    defaultFilteredValue,
    filterMode = 'menu',
    filterMultiple = true,
    filterResetToDefaultFilteredValue,
    filters,
    filterSearch = false,
  } = column;
  const normalizedSearch = searchValue.trim().toLowerCase();
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
          <div className={sx(styles.filterGroup)} key={key || index} role="group">
            <div
              className={clsx(sx(styles.filterGroupTitle), `${FILTER_CLS}-dropdown-submenu-title`)}
            >
              {item.text}
            </div>
            {children}
          </div>,
        ];
      }
      if (normalizedSearch && !matches(item)) return [];
      return [
        <div className={clsx(sx(styles.filterItem), `${FILTER_CLS}-dropdown-item`)} key={key}>
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
      <div className={clsx(sx(styles.filterSearch), `${PREFIX_CLS}-filter-dropdown-search`)}>
        <Input
          allowClear
          placeholder={locale.filterSearchPlaceholder}
          prefix={<Icon icon={Search} size={14} />}
          size="small"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    ) : null;

  const empty = (
    <Empty className={sx(styles.filterEmpty)} description={locale.filterEmptyText} imageSize={24} />
  );

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
        <div className={clsx(sx(styles.filterTree), `${PREFIX_CLS}-filter-dropdown-tree`)}>
          {filterMultiple && (
            <Checkbox
              checked={selectedKeys.length > 0 && selectedKeys.length === allKeys.length}
              className={clsx(sx(styles.filterCheckAll), `${PREFIX_CLS}-filter-dropdown-checkall`)}
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
      <div className={clsx(sx(styles.filterMenu), `${FILTER_CLS}-dropdown-menu`)}>{items}</div>
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

  return (
    <>
      {body}
      <div className={clsx(sx(styles.filterButtons), `${FILTER_CLS}-dropdown-btns`)}>
        <Button disabled={resetDisabled} size="small" type="link" onClick={() => onReset()}>
          {locale.filterReset}
        </Button>
        <Button size="small" type="primary" onClick={onConfirm}>
          {locale.filterConfirm}
        </Button>
      </div>
    </>
  );
};

export default FilterPanel;
