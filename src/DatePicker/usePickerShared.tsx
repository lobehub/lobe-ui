'use client';

import clsx from 'clsx';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useState } from 'react';

import Button from '@/Button';
import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { useFloatingLayer } from '@/hooks/useFloatingLayer';
import Icon from '@/Icon';
import { rootVariants } from '@/Input/style';
import { useThemeMode } from '@/styles/theme/scope';

import type { PickerProps as RcPickerProps } from './core';
import type { GenerateConfig } from './core/generate';
import dayjsGenerateConfig from './generateConfig';
import {
  type FilledPickerClassNames,
  type FilledPickerStyles,
  mergePickerSemantic,
} from './semantic';
import type { datePickerClasses } from './stable';
import { PREFIX_CLS, ROOT_CLS } from './style';
import type { DatePickerBaseProps, PickerClassNames, PickerStyles } from './type';

type SharedInput = Pick<
  DatePickerBaseProps<any>,
  | 'allowClear'
  | 'changeOnBlur'
  | 'className'
  | 'clearIcon'
  | 'components'
  | 'defaultOpen'
  | 'getPopupContainer'
  | 'maxDate'
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
  | 'variant'
> & {
  classNames?: PickerClassNames;
  generateConfig?: GenerateConfig<any>;
  semanticProps: object;
  stable: typeof datePickerClasses;
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
> & { classNames: FilledPickerClassNames; styles: FilledPickerStyles };

const PickerButton = (props: {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) => <Button size="small" type="primary" {...props} />;

const defaultClearIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;

// `undefined` falls back to the lobe icon; `null` (as in antd) renders nothing.
export const withDefault = (node: ReactNode, fallback: ReactNode) =>
  node === undefined ? fallback : node;

// The popup mounts on the app element / body, except inside a floating layer or dialog, where
// it nests so picking a date is not an outside press for the host.
export const usePickerShared = ({
  allowClear = true,
  changeOnBlur,
  className,
  clearIcon,
  classNames,
  components,
  defaultOpen,
  dropdownClassName,
  generateConfig = dayjsGenerateConfig,
  getPopupContainer,
  maxDate,
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
  stable,
  status,
  styles,
  suffixIcon,
  superNextIcon,
  superPrevIcon,
  variant,
}: SharedInput): SharedOutput => {
  const { isDarkMode } = useThemeMode();
  const floatingLayer = useFloatingLayer();
  const appElement = useAppElement();

  const mergedVariant = variant ?? (isDarkMode ? 'filled' : 'outlined');

  const [innerOpen, setInnerOpen] = useState(!!defaultOpen);
  const mergedOpen = open ?? innerOpen;
  const defaultPopupContainer = useCallback(
    (trigger: HTMLElement) =>
      floatingLayer ??
      trigger.closest<HTMLElement>('[role="dialog"]') ??
      appElement ??
      document.body,
    [appElement, floatingLayer],
  );

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
      input: clsx(stable('input'), semanticClassNames.input),
      popup: {
        ...semanticClassNames.popup,
        body: clsx(stable('body'), semanticClassNames.popup.body),
        container: clsx(stable('container'), semanticClassNames.popup.container),
        content: clsx(stable('content'), semanticClassNames.popup.content),
        footer: clsx(stable('footer'), semanticClassNames.popup.footer),
        header: clsx(stable('header'), semanticClassNames.popup.header),
        item: clsx(stable('item'), semanticClassNames.popup.item),
        root: clsx(
          isDarkMode && `${PREFIX_CLS}-dropdown-dark`,
          stable('popup'),
          semanticClassNames.popup.root,
        ),
      },
      prefix: clsx(stable('prefix'), semanticClassNames.prefix),
      suffix: clsx(stable('suffix'), semanticClassNames.suffix),
    },
    className: clsx(
      stable(),
      rootVariants({
        shadow,
        size: size === 'medium' ? 'middle' : size,
        variant: mergedVariant === 'underlined' ? 'borderless' : mergedVariant,
      }),
      (size === 'small' || size === 'large') && `${PREFIX_CLS}-${size}`,
      status && `${PREFIX_CLS}-status-${status}`,
      `${PREFIX_CLS}-${mergedVariant}`,
      className,
    ),
    components: { button: PickerButton, ...components },
    defaultOpen,
    generateConfig,
    getPopupContainer: getPopupContainer ?? defaultPopupContainer,
    maxDate,
    minDate,
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
    rootClassName: clsx(ROOT_CLS, rootClassName),
    styles: semanticStyles,
    suffixIcon: withDefault(
      suffixIcon,
      <Icon icon={picker === 'time' ? Clock : CalendarIcon} size={14} />,
    ),
    superNextIcon: withDefault(superNextIcon, <Icon icon={ChevronsRight} size={16} />),
    superPrevIcon: withDefault(superPrevIcon, <Icon icon={ChevronsLeft} size={16} />),
  };
};
