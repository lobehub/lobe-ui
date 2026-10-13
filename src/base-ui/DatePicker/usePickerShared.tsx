'use client';

import type { PickerProps as RcPickerProps } from '@rc-component/picker';
import { cx, useThemeMode } from 'antd-style';
import type { Dayjs } from 'dayjs';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { rootVariants } from '@/base-ui/Input/style';
import { acquireLayerZIndex } from '@/base-ui/zIndex';
import { useFloatingLayer } from '@/hooks/useFloatingLayer';
import Icon from '@/Icon';
import { useAppElement } from '@/ThemeProvider/AppElementContext';

import generateConfig from './generateConfig';
import { PREFIX_CLS, styles as pickerStyles } from './style';
import type { DatePickerProps } from './type';

type SharedInput = Pick<
  DatePickerProps,
  | 'allowClear'
  | 'className'
  | 'classNames'
  | 'defaultOpen'
  | 'getPopupContainer'
  | 'max'
  | 'maxDate'
  | 'min'
  | 'minDate'
  | 'nextIcon'
  | 'onOpenChange'
  | 'open'
  | 'prevIcon'
  | 'rootClassName'
  | 'shadow'
  | 'size'
  | 'styles'
  | 'suffixIcon'
  | 'superNextIcon'
  | 'superPrevIcon'
  | 'transitionName'
  | 'variant'
>;

type SharedOutput = Pick<
  RcPickerProps<Dayjs>,
  | 'allowClear'
  | 'className'
  | 'defaultOpen'
  | 'generateConfig'
  | 'getPopupContainer'
  | 'maxDate'
  | 'minDate'
  | 'nextIcon'
  | 'onOpenChange'
  | 'open'
  | 'prefixCls'
  | 'prevIcon'
  | 'rootClassName'
  | 'suffixIcon'
  | 'superNextIcon'
  | 'superPrevIcon'
  | 'transitionName'
> & { classNames: any; styles: any };

const clearIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;

/**
 * Wiring shared by DatePicker and RangePicker: lobe prefix, dayjs adapter, base-ui
 * Input look, lucide icons, and the popup container / z-index.
 *
 * rc-trigger keeps the popup inside every clipping ancestor of its container, so like
 * antd it mounts on `document.body` and carries the theme's `css-var-*` scope class —
 * except inside a base-ui floating layer or dialog, where it nests so picking a date is
 * not an outside press for the host.
 */
export const usePickerShared = ({
  allowClear = true,
  className,
  classNames,
  defaultOpen,
  getPopupContainer,
  max,
  maxDate,
  min,
  minDate,
  nextIcon,
  onOpenChange,
  open,
  prevIcon,
  rootClassName,
  shadow,
  size,
  styles,
  suffixIcon,
  superNextIcon,
  superPrevIcon,
  transitionName,
  variant,
}: SharedInput): SharedOutput => {
  const { isDarkMode } = useThemeMode();
  const floatingLayer = useFloatingLayer();
  const appElement = useAppElement();

  const [innerOpen, setInnerOpen] = useState(!!defaultOpen);
  const mergedOpen = open ?? innerOpen;
  const [zIndex, setZIndex] = useState<number>();

  // Each opening takes the next slot, so a picker opened from a Modal / Popover stacks above it.
  useLayoutEffect(() => {
    if (mergedOpen) setZIndex(acquireLayerZIndex('floating'));
  }, [mergedOpen]);

  const defaultPopupContainer = useCallback(
    (trigger: HTMLElement) =>
      floatingLayer ?? trigger.closest<HTMLElement>('[role="dialog"]') ?? document.body,
    [floatingLayer],
  );

  // The CSS variables behind `cssVar` tokens (incl. dark mode) live on this class.
  const themeScopeClassName = useMemo(() => {
    const scope = appElement?.closest('[class*="css-var-"]');
    if (!scope) return undefined;
    return [...scope.classList].filter((name) => name.startsWith('css-var-')).join(' ');
  }, [appElement]);

  return {
    allowClear: allowClear === true ? { clearIcon } : allowClear,
    classNames: {
      ...classNames,
      popup: { ...classNames?.popup, root: cx(themeScopeClassName, classNames?.popup?.root) },
    },
    className: cx(
      rootVariants({ shadow, size, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
      className,
    ),
    defaultOpen,
    generateConfig,
    getPopupContainer: getPopupContainer ?? defaultPopupContainer,
    maxDate: maxDate ?? max,
    minDate: minDate ?? min,
    nextIcon: nextIcon ?? <Icon icon={ChevronRight} size={16} />,
    onOpenChange: (next: boolean) => {
      setInnerOpen(next);
      onOpenChange?.(next);
    },
    open,
    prefixCls: PREFIX_CLS,
    prevIcon: prevIcon ?? <Icon icon={ChevronLeft} size={16} />,
    rootClassName: cx(pickerStyles.root, rootClassName),
    styles: { ...styles, popup: { ...styles?.popup, root: { zIndex, ...styles?.popup?.root } } },
    suffixIcon: suffixIcon ?? <Icon icon={CalendarIcon} size={14} />,
    superNextIcon: superNextIcon ?? <Icon icon={ChevronsRight} size={16} />,
    superPrevIcon: superPrevIcon ?? <Icon icon={ChevronsLeft} size={16} />,
    transitionName: transitionName ?? `${PREFIX_CLS}-slide-up`,
  };
};
