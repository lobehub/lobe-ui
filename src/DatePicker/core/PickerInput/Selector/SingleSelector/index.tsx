import { clsx } from 'clsx';
import * as React from 'react';

import type { InternalMode, PickerRef, SelectorProps } from '../../../interface';
import { isReactRenderable } from '../../../utils/common';
import { isSame } from '../../../utils/dateUtil';
import PickerContext from '../../context';
import type { PickerProps } from '../../SinglePicker';
import ClearIcon from '../ClearIcon';
import useInputProps from '../hooks/useInputProps';
import useRootProps from '../hooks/useRootProps';
import Icon from '../Icon';
import Input, { type InputRef } from '../Input';
import MultipleDates from './MultipleDates';

export interface SingleSelectorProps<DateType extends object = any>
  extends SelectorProps<DateType>, Pick<PickerProps, 'multiple' | 'maxTagCount' | 'tagRender'> {
  /** All the field show as `placeholder` */
  allHelp: boolean;

  disabled?: boolean;
  id?: string;

  internalPicker: InternalMode;

  // Invalid
  invalid: boolean;

  onChange: (date: DateType[], source?: 'input' | 'remove') => void;

  onInvalid: (valid: boolean) => void;

  placeholder?: string;
  removeIcon?: React.ReactNode;

  value?: DateType[];
}

function SingleSelector<DateType extends object = any>(
  props: SingleSelectorProps<DateType>,
  ref: React.Ref<PickerRef>,
) {
  const {
    id,

    open,

    prefix,
    clearIcon,
    suffixIcon,
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
    internalPicker,
    value,
    onChange,
    onSubmit,
    onInputChange,
    multiple,
    maxTagCount,
    tagRender,

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

    // Native
    onMouseDown,

    // Input
    required,
    'aria-required': ariaRequired,
    autoFocus,
    tabIndex,

    removeIcon,

    ...restProps
  } = props;

  const rtl = direction === 'rtl';

  // ======================== Prefix ========================
  const { prefixCls, classNames, styles } = React.use(PickerContext);

  // ========================= Refs =========================
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<InputRef>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
    focus: (options) => {
      inputRef.current?.focus(options);
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  // ======================== Props =========================
  const rootProps = useRootProps(restProps);

  // ======================== Change ========================
  const onSingleChange = (date: DateType) => {
    onChange([date], 'input');
  };

  const onMultipleRemove = (date: DateType) => {
    const nextValues = value!.filter(
      (oriDate) => oriDate && !isSame(generateConfig, locale, oriDate, date, internalPicker),
    );
    // An open popup keeps removal temporary until confirmation. Removing while
    // closed is final and submits through the explicit `remove` source.
    // popup 打开时仅保留临时删除值并等待确认；关闭时删除是最终操作，通过
    // 明确的 `remove` 来源提交。
    onChange(nextValues, open ? 'input' : 'remove');
  };

  // ======================== Inputs ========================
  const [getInputProps, getText] = useInputProps<DateType>(
    {
      ...props,
      onChange: onSingleChange,
    },
    ({ valueTexts }) => ({
      value: valueTexts[0] || '',
      active: focused,
    }),
  );

  // ======================== Clear =========================
  const showClear = isReactRenderable(clearIcon) && Boolean(value!.length) && !disabled;

  // ======================= Multiple =======================
  const selectorNode = multiple ? (
    <>
      <MultipleDates
        disabled={disabled}
        formatDate={getText}
        maxTagCount={maxTagCount}
        placeholder={placeholder}
        prefixCls={prefixCls}
        removeIcon={removeIcon}
        tagRender={tagRender}
        value={value!}
        onRemove={onMultipleRemove}
      />
      <input
        readOnly
        autoFocus={autoFocus}
        className={`${prefixCls}-multiple-input`}
        ref={inputRef as any}
        tabIndex={tabIndex}
        value={value!.map(getText).join(',')}
      />
      <Icon icon={suffixIcon} />
      {showClear && <ClearIcon icon={clearIcon} onClear={onClear} />}
    </>
  ) : (
    <Input
      ref={inputRef}
      {...getInputProps()}
      autoFocus={autoFocus}
      clearIcon={showClear && <ClearIcon icon={clearIcon} onClear={onClear} />}
      showActiveCls={false}
      suffixIcon={suffixIcon}
      tabIndex={tabIndex}
    />
  );

  // ======================== Render ========================
  return (
    <div
      {...rootProps}
      ref={rootRef}
      style={style}
      className={clsx(
        prefixCls,
        {
          [`${prefixCls}-multiple`]: multiple,
          [`${prefixCls}-focused`]: focused,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-invalid`]: invalid,
          [`${prefixCls}-rtl`]: rtl,
        },
        className,
      )}
      onClick={onClick}
      // Not lose current input focus
      onMouseDown={(e) => {
        const { target } = e;
        if (target !== inputRef.current?.inputElement) {
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
      {selectorNode}
    </div>
  );
}

const RefSingleSelector = React.forwardRef<PickerRef, SingleSelectorProps>(SingleSelector);

if (process.env.NODE_ENV !== 'production') {
  RefSingleSelector.displayName = 'SingleSelector';
}

export default RefSingleSelector;
