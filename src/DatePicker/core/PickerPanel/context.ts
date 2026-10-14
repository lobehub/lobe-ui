import * as React from 'react';

import type { FilledPanelClassNames, FilledPanelStyles } from '../hooks/useSemantic';
import type { PanelMode, SharedPanelProps } from '../interface';

export interface SharedPanelContextProps {
  classNames: FilledPanelClassNames;
  styles: FilledPanelStyles;
}

export const SharedPanelContext = React.createContext<SharedPanelContextProps>(null!);

export interface PanelContextProps<DateType extends object = any> extends Pick<
  SharedPanelProps<DateType>,
  | 'prefixCls'
  | 'cellRender'
  | 'generateConfig'
  | 'locale'
  | 'onSelect'
  | 'hoverValue'
  | 'hoverRangeValue'
  | 'onHover'
  | 'values'
  | 'pickerValue'

  // Limitation
  | 'disabledDate'
  | 'minDate'
  | 'maxDate'

  // Icon
  | 'prevIcon'
  | 'nextIcon'
  | 'superPrevIcon'
  | 'superNextIcon'
> {
  classNames: FilledPanelClassNames;

  // Shared
  now: DateType;

  /** Tell current panel type */
  panelType: PanelMode;
  styles: FilledPanelStyles;
}

/** Used for each single Panel. e.g. DatePanel */
export const PanelContext = React.createContext<PanelContextProps>(null!);

export function usePanelContext<DateType extends object = any>(): PanelContextProps<DateType> {
  return React.useContext<PanelContextProps<DateType>>(PanelContext);
}

/**
 * Get shared props for the SharedPanelProps interface.
 */
export function useInfo<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
  panelType: PanelMode,
): [sharedProps: PanelContextProps<DateType>, now: DateType] {
  // TODO: this is not good to get from each props.
  // Should move to `SharedPanelContext` instead.
  const {
    prefixCls,
    generateConfig,
    locale,
    disabledDate,
    minDate,
    maxDate,
    cellRender,
    hoverValue,
    hoverRangeValue,
    onHover,
    values,
    pickerValue,
    onSelect,

    // Icons
    prevIcon,
    nextIcon,
    superPrevIcon,
    superNextIcon,
  } = props;

  // ======================= Context ========================
  const { classNames, styles } = React.useContext(SharedPanelContext);

  // ========================= MISC =========================
  const now = generateConfig.getNow();

  // ========================= Info =========================
  const info = {
    now,
    values,
    pickerValue,
    prefixCls,
    classNames,
    styles,
    disabledDate,
    minDate,
    maxDate,
    cellRender,
    hoverValue,
    hoverRangeValue,
    onHover,
    locale,
    generateConfig,
    onSelect,
    panelType,

    // Icons
    prevIcon,
    nextIcon,
    superPrevIcon,
    superNextIcon,
  };

  return [info, now];
}

// ============================== Internal ==============================
export interface PickerHackContextProps {
  hideHeader?: boolean;
  hideNext?: boolean;
  hidePrev?: boolean;
  onCellDblClick?: () => void;
}

/**
 * Internal usage for RangePicker to not to show the operation arrow
 */
export const PickerHackContext = React.createContext<PickerHackContextProps>({});

if (process.env.NODE_ENV !== 'production') {
  PickerHackContext.displayName = 'PickerHackContext';
}
