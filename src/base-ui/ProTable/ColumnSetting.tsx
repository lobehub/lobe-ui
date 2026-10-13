import {
  ArrowDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  PinOff,
  Settings,
} from 'lucide-react';
import { type ReactNode, useRef } from 'react';

import ActionIcon from '@/base-ui/ActionIcon';
import Button from '@/base-ui/Button';
import Checkbox from '@/base-ui/Checkbox/Checkbox';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/base-ui/Popover';

import { styles } from './style';
import type { ProTableColumnsStateItem, ProTableColumnsStateMap, ProTableLocale } from './type';

export interface SettingColumn {
  disabled: boolean;
  key: string;
  title: ReactNode;
}

type FixedGroup = 'start' | 'none' | 'end';

export const fixedGroupOf = (fixed: ProTableColumnsStateItem['fixed']): FixedGroup => {
  if (fixed === true || fixed === 'left' || fixed === 'start') return 'start';
  if (fixed === 'right' || fixed === 'end') return 'end';
  return 'none';
};

export interface ColumnSettingProps {
  checkable?: boolean;
  columns: SettingColumn[];
  draggable?: boolean;
  locale: Required<
    Pick<
      ProTableLocale,
      | 'columnSetting'
      | 'columnSettingReset'
      | 'columnSettingTitle'
      | 'fixedEnd'
      | 'fixedEndTitle'
      | 'fixedStart'
      | 'fixedStartTitle'
      | 'moveDown'
      | 'moveUp'
      | 'noFixed'
      | 'unfixedTitle'
    >
  >;
  onChange: (map: ProTableColumnsStateMap) => void;
  onReset: () => void;
  showListItemOption?: boolean;
  state: ProTableColumnsStateMap;
}

/** Toolbar "column setting" panel: show / hide, pin to start / end, reorder, reset. */
const ColumnSetting = ({
  checkable = true,
  columns,
  draggable = true,
  locale,
  onChange,
  onReset,
  showListItemOption = true,
  state,
}: ColumnSettingProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isShown = (key: string) => state[key]?.show !== false;
  const toggleable = columns.filter((column) => !column.disabled);
  const shownCount = toggleable.filter((column) => isShown(column.key)).length;

  const patch = (key: string, value: Partial<ProTableColumnsStateItem>) =>
    onChange({ ...state, [key]: { ...state[key], ...value } });

  const setAll = (show: boolean) => {
    const next = { ...state };
    toggleable.forEach(({ key }) => {
      next[key] = { ...next[key], show };
    });
    onChange(next);
  };

  const groups: Record<FixedGroup, SettingColumn[]> = { end: [], none: [], start: [] };
  columns.forEach((column) => groups[fixedGroupOf(state[column.key]?.fixed)].push(column));

  // Reorder within the full list; `order` is rewritten for every column so it stays dense.
  const move = (key: string, delta: -1 | 1) => {
    const keys = columns.map((column) => column.key);
    const from = keys.indexOf(key);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= keys.length) return;
    [keys[from], keys[to]] = [keys[to], keys[from]];
    const next = { ...state };
    keys.forEach((k, order) => {
      next[k] = { ...next[k], order };
    });
    onChange(next);
  };

  const renderItem = (column: SettingColumn, group: FixedGroup) => {
    const position = columns.indexOf(column);
    return (
      <div className={styles.settingItem} data-column-key={column.key} key={column.key}>
        {checkable ? (
          <Checkbox
            checked={isShown(column.key)}
            disabled={column.disabled}
            onChange={(checked) => patch(column.key, { show: checked })}
          >
            <span className={styles.settingItemTitle}>{column.title}</span>
          </Checkbox>
        ) : (
          <span className={styles.settingItemTitle}>{column.title}</span>
        )}
        <span style={{ flex: 1 }} />
        <span className={styles.settingItemActions} data-setting-actions="">
          {showListItemOption && group !== 'start' && (
            <ActionIcon
              aria-label={locale.fixedStart}
              icon={ArrowLeftToLine}
              size="small"
              onClick={() => patch(column.key, { fixed: 'start' })}
            />
          )}
          {showListItemOption && group !== 'none' && (
            <ActionIcon
              aria-label={locale.noFixed}
              icon={PinOff}
              size="small"
              onClick={() => patch(column.key, { fixed: undefined })}
            />
          )}
          {showListItemOption && group !== 'end' && (
            <ActionIcon
              aria-label={locale.fixedEnd}
              icon={ArrowRightToLine}
              size="small"
              onClick={() => patch(column.key, { fixed: 'end' })}
            />
          )}
          {draggable && (
            <>
              <ActionIcon
                aria-label={locale.moveUp}
                disabled={position === 0}
                icon={ArrowUp}
                size="small"
                onClick={() => move(column.key, -1)}
              />
              <ActionIcon
                aria-label={locale.moveDown}
                disabled={position === columns.length - 1}
                icon={ArrowDown}
                size="small"
                onClick={() => move(column.key, 1)}
              />
            </>
          )}
        </span>
      </div>
    );
  };

  const titles: Record<FixedGroup, ReactNode> = {
    end: locale.fixedEndTitle,
    none: locale.unfixedTitle,
    start: locale.fixedStartTitle,
  };
  const pinnedAny = groups.start.length > 0 || groups.end.length > 0;

  const panel = (
    <div className={styles.setting} data-pro-table-setting="">
      <div className={styles.settingHeader}>
        {checkable ? (
          <Checkbox
            checked={shownCount > 0 && shownCount === toggleable.length}
            indeterminate={shownCount > 0 && shownCount < toggleable.length}
            onChange={(checked) => setAll(checked)}
          >
            {locale.columnSettingTitle}
          </Checkbox>
        ) : (
          <span>{locale.columnSettingTitle}</span>
        )}
        <Button size="small" type="link" onClick={onReset}>
          {locale.columnSettingReset}
        </Button>
      </div>
      <div className={styles.settingList}>
        {(['start', 'none', 'end'] as FixedGroup[]).map((group) =>
          groups[group].length === 0 ? null : (
            <div data-group={group} key={group}>
              {pinnedAny && <div className={styles.settingGroupTitle}>{titles[group]}</div>}
              {groups[group].map((column) => renderItem(column, group))}
            </div>
          ),
        )}
      </div>
    </div>
  );

  return (
    <PopoverRoot>
      <PopoverTriggerElement>
        <ActionIcon aria-label={locale.columnSetting} icon={Settings} ref={triggerRef} />
      </PopoverTriggerElement>
      <PopoverPortal>
        <PopoverPositioner placement="bottomRight" sideOffset={4}>
          <PopoverPopup>{panel}</PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  );
};

export default ColumnSetting;
