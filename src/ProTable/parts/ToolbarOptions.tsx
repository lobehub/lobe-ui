'use client';

import { Check, Fullscreen, Minimize, RotateCw, Rows3, Settings } from 'lucide-react';
import { useState } from 'react';

import ActionIconGroup, { type ActionIconGroupItemType } from '@/ActionIconGroup';

import type { ProTableLocaleResolved } from '../locale';
import { PRO_PREFIX_CLS, styles } from '../style';
import type { ProTableColumnsStateMap, ProTableDensity, ProTableOptionConfig } from '../type';
import ColumnSetting, { type SettingColumn } from './ColumnSetting';
import OptionPopover from './OptionPopover';

const DENSITIES: ProTableDensity[] = ['large', 'middle', 'small'];

interface ToolbarOptionsProps {
  columnsState: ProTableColumnsStateMap;
  config: ProTableOptionConfig;
  fullscreen: boolean;
  locale: ProTableLocaleResolved;
  onColumnsStateChange: (map: ProTableColumnsStateMap) => void;
  onColumnsStateReset: () => void;
  onReload: () => void;
  onSizeChange: (size: ProTableDensity) => void;
  onToggleFullScreen: () => void;
  reloading: boolean;
  settingColumns: SettingColumn[];
  size: ProTableDensity;
}

const ToolbarOptions = ({
  columnsState,
  config,
  fullscreen,
  locale,
  onColumnsStateChange,
  onColumnsStateReset,
  onReload,
  onSizeChange,
  onToggleFullScreen,
  reloading,
  settingColumns,
  size,
}: ToolbarOptionsProps) => {
  const [open, setOpen] = useState<{ anchor: HTMLElement; key: string } | null>(null);
  const toggle = (key: string, event: unknown) => {
    const anchor = (event as { currentTarget?: HTMLElement } | undefined)?.currentTarget ?? null;
    setOpen((prev) => (prev?.key === key || !anchor ? null : { anchor, key }));
  };
  const close = () => setOpen(null);

  const { density, fullScreen, reload, setting } = config;
  const items: ActionIconGroupItemType[] = [];
  if (reload) {
    items.push({
      icon: RotateCw,
      key: 'reload',
      label: locale.reload,
      loading: reloading,
      onClick: () => (typeof reload === 'function' ? reload() : onReload()),
    });
  }
  if (density) {
    items.push({
      icon: Rows3,
      key: 'density',
      label: locale.density,
      onClick: ((event: unknown) => toggle('density', event)) as any,
    });
  }
  if (fullScreen) {
    items.push({
      icon: fullscreen ? Minimize : Fullscreen,
      key: 'fullScreen',
      label: locale.fullScreen,
      onClick: () => (typeof fullScreen === 'function' ? fullScreen() : onToggleFullScreen()),
    });
  }
  if (setting) {
    items.push({
      icon: Settings,
      key: 'setting',
      label: locale.columnSetting,
      onClick: ((event: unknown) => toggle('setting', event)) as any,
    });
  }
  if (items.length === 0) return null;

  const settingProps = typeof setting === 'object' ? setting : {};
  const densityLabel = (item: ProTableDensity) =>
    item === 'large'
      ? locale.densityLarge
      : item === 'middle'
        ? locale.densityMedium
        : locale.densitySmall;

  return (
    <>
      <ActionIconGroup
        className={`${PRO_PREFIX_CLS}-options`}
        items={items}
        size="small"
        variant="outlined"
      />
      <OptionPopover
        anchor={open?.key === 'density' ? open.anchor : null}
        open={open?.key === 'density'}
        onOpenChange={(next) => !next && close()}
      >
        <div className={styles.density} data-pro-table-density="" role="menu">
          {DENSITIES.map((item) => (
            <button
              aria-checked={size === item}
              className={styles.densityItem}
              key={item}
              role="menuitemradio"
              type="button"
              onClick={() => {
                onSizeChange(item);
                close();
              }}
            >
              <span>{densityLabel(item)}</span>
              {size === item && <Check size={14} />}
            </button>
          ))}
        </div>
      </OptionPopover>
      <OptionPopover
        anchor={open?.key === 'setting' ? open.anchor : null}
        open={open?.key === 'setting'}
        onOpenChange={(next) => !next && close()}
      >
        <ColumnSetting
          checkable={settingProps.checkable}
          columns={settingColumns}
          draggable={settingProps.draggable}
          locale={locale}
          showListItemOption={settingProps.showListItemOption}
          state={columnsState}
          onChange={onColumnsStateChange}
          onReset={onColumnsStateReset}
        />
      </OptionPopover>
    </>
  );
};

export default ToolbarOptions;
