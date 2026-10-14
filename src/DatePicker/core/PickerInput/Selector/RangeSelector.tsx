import { clsx } from 'clsx';
import * as React from 'react';

import { useEvent, useResizeObserver } from '../../hooks/react';
import type { RangePickerRef, SelectorProps } from '../../interface';
import { isReactRenderable } from '../../utils/common';
import PickerContext from '../context';
import ClearIcon from './ClearIcon';
import useInputProps from './hooks/useInputProps';
import useRootProps from './hooks/useRootProps';
import Icon from './Icon';
import Input, { type InputRef } from './Input';

export type SelectorIdType =
  | string
  | {
      start?: string;
      end?: string;
    };

export interface RangeSelectorRef extends RangePickerRef {
  endInput: HTMLInputElement;
  startInput: HTMLInputElement;
}

export interface RangeSelectorProps<DateType = any> extends SelectorProps<DateType> {
  activeIndex: number | null;

  /** All the field show as `placeholder` */
  allHelp: boolean;

  disabled: [boolean, boolean];

  id?: SelectorIdType;
  // Invalid
  invalid: [boolean, boolean];

  // Offset
  /**
   * Trigger when the active bar offset position changed.
   * This is used for popup panel offset.
   */
  onActiveInfo: (
    info: [activeInputLeft: number, activeInputRight: number, selectorWidth: number],
  ) => void;

  onChange: (date: DateType, index?: number) => void;

  placeholder?: string | [string, string];

  placement?: string;
  separator?: React.ReactNode;
  value?: [start?: DateType | null, end?: DateType | null];
}

function RangeSelector<DateType extends object = any>(
  props: RangeSelectorProps<DateType>,
  ref: React.Ref<RangeSelectorRef>,
) {
  const {
    id,

    prefix,
    clearIcon,
    suffixIcon,
    separator = '~',
    activeIndex,
    activeHelp,
    allHelp,

    focused,
    onFocus,
    onBlur,
    onKeyDown,
    locale,
    generateConfig,

    // Placeholder
    placeholder,

    // Style
    className,
    style,

    // Click
    onClick,
    onClear,

    // Change
    value,
    onChange,
    onSubmit,
    onInputChange,

    // Valid
    format,
    maskFormat,
    preserveInvalidOnBlur,
    onInvalid,

    // Disabled
    disabled,
    invalid,
    inputReadOnly,

    // Direction
    direction,

    // Open
    onOpenChange,

    // Offset
    onActiveInfo,
    placement,

    // Native
    onMouseDown,

    // Input
    required,
    'aria-required': ariaRequired,
    autoFocus,
    tabIndex,

    ...restProps
  } = props;

  const rtl = direction === 'rtl';

  // ======================== Prefix ========================
  const { prefixCls, classNames, styles } = React.use(PickerContext);

  // ========================== Id ==========================
  const ids = React.useMemo(() => {
    if (typeof id === 'string') {
      return [id];
    }

    const mergedId = id || {};

    return [mergedId.start, mergedId.end];
  }, [id]);

  // ========================= Refs =========================
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputStartRef = React.useRef<InputRef>(null);
  const inputEndRef = React.useRef<InputRef>(null);

  const getInput = (index: number) => [inputStartRef, inputEndRef][index]?.current;

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
    startInput: inputStartRef.current!.inputElement,
    endInput: inputEndRef.current!.inputElement,
    focus: (options) => {
      if (typeof options === 'object') {
        const { index = 0, ...rest } = options || {};
        getInput(index)?.focus(rest);
      } else {
        getInput(options ?? 0)?.focus();
      }
    },
    blur: () => {
      getInput(0)?.blur();
      getInput(1)?.blur();
    },
  }));

  // ======================== Props =========================
  const rootProps = useRootProps(restProps);

  // ===================== Placeholder ======================
  const mergedPlaceholder = React.useMemo<[string | undefined, string | undefined]>(
    () => (Array.isArray(placeholder) ? placeholder : [placeholder, placeholder]),
    [placeholder],
  );

  // ======================== Inputs ========================
  const [getInputProps] = useInputProps({
    ...props,
    id: ids,
    placeholder: mergedPlaceholder,
  });

  // ====================== ActiveBar =======================
  const [activeBarStyle, setActiveBarStyle] = React.useState<React.CSSProperties>({
    position: 'absolute',
    width: 0,
  });

  const syncActiveOffset = useEvent(() => {
    const input = getInput(activeIndex!);
    if (input) {
      const inputRect = input.nativeElement.getBoundingClientRect();
      const parentRect = rootRef.current!.getBoundingClientRect();

      const rectOffset = inputRect.left - parentRect.left;
      setActiveBarStyle((ori) => ({
        ...ori,
        width: inputRect.width,
        left: rectOffset,
      }));
      onActiveInfo([inputRect.left, inputRect.right, parentRect.width]);
    }
  });

  React.useEffect(() => {
    syncActiveOffset();
  }, [activeIndex]);

  useResizeObserver(rootRef, syncActiveOffset);

  // ======================== Clear =========================
  const showClear =
    isReactRenderable(clearIcon) && ((value![0] && !disabled[0]) || (value![1] && !disabled[1]));

  // ======================= Disabled =======================
  const startAutoFocus = autoFocus && !disabled[0];
  const endAutoFocus = autoFocus && !startAutoFocus && !disabled[1];

  // ======================== Render ========================
  return (
    <div
      {...rootProps}
      ref={rootRef}
      style={style}
      className={clsx(
        prefixCls,
        `${prefixCls}-range`,
        {
          [`${prefixCls}-focused`]: focused,
          [`${prefixCls}-disabled`]: disabled.every((i) => i),
          [`${prefixCls}-invalid`]: invalid.some((i) => i),
          [`${prefixCls}-rtl`]: rtl,
        },
        className,
      )}
      onClick={onClick}
      // Not lose current input focus
      onMouseDown={(e) => {
        const { target } = e;
        if (
          target !== inputStartRef.current!.inputElement &&
          target !== inputEndRef.current!.inputElement
        ) {
          e.preventDefault();
        }

        onMouseDown?.(e);
      }}
    >
      {isReactRenderable(prefix) && (
        <div className={clsx(`${prefixCls}-prefix`, classNames.prefix)} style={styles.prefix}>
          {prefix}
        </div>
      )}
      <Input
        ref={inputStartRef}
        {...getInputProps(0)}
        autoFocus={startAutoFocus}
        className={`${prefixCls}-input-start`}
        date-range="start"
        tabIndex={tabIndex}
      />
      <div className={`${prefixCls}-range-separator`}>{separator}</div>
      <Input
        ref={inputEndRef}
        {...getInputProps(1)}
        autoFocus={endAutoFocus}
        className={`${prefixCls}-input-end`}
        date-range="end"
        tabIndex={tabIndex}
      />
      <div className={`${prefixCls}-active-bar`} style={activeBarStyle} />
      <Icon icon={suffixIcon} />
      {showClear && <ClearIcon icon={clearIcon} onClear={onClear} />}
    </div>
  );
}

const RefRangeSelector = React.forwardRef<RangeSelectorRef, RangeSelectorProps>(RangeSelector);

if (process.env.NODE_ENV !== 'production') {
  RefRangeSelector.displayName = 'RangeSelector';
}

export default RefRangeSelector;
