'use client';

import type { PickerProps as RcPickerProps } from '@rc-component/picker';
import type { GenerateConfig } from '@rc-component/picker/generate';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react';

import Button from '@/base-ui/Button';
import { rootVariants } from '@/base-ui/Input/style';
import { acquireLayerZIndex } from '@/base-ui/zIndex';
import { useFloatingLayer } from '@/hooks/useFloatingLayer';
import Icon from '@/Icon';
import { useAppElement } from '@/ThemeProvider/AppElementContext';
import { cx, useThemeMode } from '@/utils/styleEngine';

import dayjsGenerateConfig from './generateConfig';
import {
  type FilledPickerClassNames,
  type FilledPickerStyles,
  mergePickerSemantic,
} from './semantic';
import { PREFIX_CLS, styles as pickerStyles } from './style';
import type { DatePickerBaseProps, PickerClassNames, PickerStyles } from './type';

type SharedInput = Pick<
  DatePickerBaseProps<any>,
  | 'allowClear'
  | 'bordered'
  | 'changeOnBlur'
  | 'className'
  | 'clearIcon'
  | 'components'
  | 'defaultOpen'
  | 'getPopupContainer'
  | 'max'
  | 'maxDate'
  | 'min'
  | 'minDate'
  | 'needConfirm'
  | 'nextIcon'
  | 'onKeyDown'
  | 'onOpenChange'
  | 'open'
  | 'picker'
  | 'prevIcon'
  | 'rootClassName'
  | 'dropdownClassName'
  | 'popupClassName'
  | 'popupStyle'
  | 'shadow'
  | 'size'
  | 'status'
  | 'suffixIcon'
  | 'superNextIcon'
  | 'superPrevIcon'
  | 'transitionName'
  | 'variant'
> & {
  classNames?: PickerClassNames;
  /** The date library adapter, from `generatePicker`; Dayjs by default. */
  generateConfig?: GenerateConfig<any>;
  /** The picker's props, passed as `info.props` to the function forms of `classNames` / `styles`. */
  semanticProps: object;
  styles?: PickerStyles;
};

type SharedOutput = Pick<
  RcPickerProps<any>,
  | 'allowClear'
  | 'className'
  | 'components'
  | 'defaultOpen'
  | 'generateConfig'
  | 'getPopupContainer'
  | 'maxDate'
  | 'minDate'
  | 'needConfirm'
  | 'nextIcon'
  | 'onKeyDown'
  | 'onOpenChange'
  | 'open'
  | 'prefixCls'
  | 'prevIcon'
  | 'rootClassName'
  | 'suffixIcon'
  | 'superNextIcon'
  | 'superPrevIcon'
  | 'transitionName'
> & { classNames: FilledPickerClassNames; styles: FilledPickerStyles };

/** antd's `PickerButton`: the panel's OK button is a small primary button. */
const PickerButton = (props: {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) => <Button size="small" type="primary" {...props} />;

const defaultClearIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;

/** `undefined` falls back to the lobe icon; `null` (as in antd) renders nothing. */
export const withDefault = (node: ReactNode, fallback: ReactNode) =>
  node === undefined ? fallback : node;

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
  bordered,
  changeOnBlur,
  className,
  clearIcon,
  classNames,
  components,
  defaultOpen,
  dropdownClassName,
  generateConfig = dayjsGenerateConfig,
  getPopupContainer,
  max,
  maxDate,
  min,
  minDate,
  needConfirm,
  nextIcon,
  onKeyDown,
  onOpenChange,
  open,
  picker,
  popupClassName,
  popupStyle,
  prevIcon,
  rootClassName,
  semanticProps,
  shadow,
  size,
  status,
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

  // As in antd: an explicit `variant` wins over the deprecated `bordered`.
  const mergedVariant =
    variant ?? (bordered === false ? 'borderless' : isDarkMode ? 'filled' : 'outlined');

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

  // As in antd, `info.props` carries the merged size.
  const [semanticClassNames, semanticStyles] = mergePickerSemantic({
    classNames,
    popupClassName: popupClassName ?? dropdownClassName,
    popupStyle,
    props: { ...semanticProps, size: size ?? 'medium' },
    styles,
  });

  return {
    allowClear: allowClear && {
      clearIcon:
        (typeof allowClear === 'object' ? allowClear.clearIcon : undefined) ??
        clearIcon ??
        defaultClearIcon,
    },
    classNames: {
      ...semanticClassNames,
      popup: {
        ...semanticClassNames.popup,
        root: cx(
          themeScopeClassName,
          isDarkMode && `${PREFIX_CLS}-dropdown-dark`,
          semanticClassNames.popup.root,
        ),
      },
    },
    className: cx(
      rootVariants({
        shadow,
        size: size === 'medium' ? 'middle' : size,
        variant: mergedVariant === 'underlined' ? 'borderless' : mergedVariant,
      }),
      mergedVariant === 'underlined' && pickerStyles.underlined,
      (size === 'small' || size === 'large') && `${PREFIX_CLS}-${size}`,
      status && `${PREFIX_CLS}-status-${status}`,
      `${PREFIX_CLS}-${mergedVariant}`,
      className,
    ),
    components: { button: PickerButton, ...components },
    defaultOpen,
    generateConfig,
    getPopupContainer: getPopupContainer ?? defaultPopupContainer,
    maxDate: maxDate ?? max,
    minDate: minDate ?? min,
    // rc-picker dropped `changeOnBlur`; committing on close is what `needConfirm={false}` does.
    needConfirm: needConfirm ?? (changeOnBlur ? false : undefined),
    nextIcon: withDefault(nextIcon, <Icon icon={ChevronRight} size={16} />),
    // Escape closes only the popup, not a Modal / Popover hosting the picker.
    onKeyDown: (event, preventDefault) => {
      if (event.key === 'Escape' && mergedOpen) event.stopPropagation();
      onKeyDown?.(event, preventDefault);
    },
    onOpenChange: (next: boolean) => {
      setInnerOpen(next);
      onOpenChange?.(next);
    },
    open,
    prefixCls: PREFIX_CLS,
    prevIcon: withDefault(prevIcon, <Icon icon={ChevronLeft} size={16} />),
    rootClassName: cx(pickerStyles.root, rootClassName),
    styles: {
      ...semanticStyles,
      popup: { ...semanticStyles.popup, root: { zIndex, ...semanticStyles.popup.root } },
    },
    suffixIcon: withDefault(
      suffixIcon,
      <Icon icon={picker === 'time' ? Clock : CalendarIcon} size={14} />,
    ),
    superNextIcon: withDefault(superNextIcon, <Icon icon={ChevronsRight} size={16} />),
    superPrevIcon: withDefault(superPrevIcon, <Icon icon={ChevronsLeft} size={16} />),
    transitionName: transitionName ?? `${PREFIX_CLS}-slide-up`,
  };
};
