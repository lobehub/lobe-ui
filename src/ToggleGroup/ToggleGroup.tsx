'use client';

import clsx from 'clsx';
import { type CSSProperties, type Ref, useMemo } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import { toDataAttributes } from '@/utils/bem';

import {
  ToggleGroupItem,
  ToggleGroupItemIcon,
  ToggleGroupItemLabel,
  ToggleGroupRoot,
} from './atoms';
import type {
  ToggleGroupClassNames,
  ToggleGroupOption,
  ToggleGroupProps,
  ToggleGroupSize,
  ToggleGroupStyles,
  ToggleGroupVariant,
} from './type';

const normalizeOption = <Value extends string>(
  option: ToggleGroupOption<Value> | Value,
): ToggleGroupOption<Value> => (typeof option === 'string' ? { value: option } : option);

const toValueArray = <Value extends string>(value?: Value | Value[]): Value[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

interface InternalProps<Value extends string = string> {
  className?: string;
  classNames?: ToggleGroupClassNames;
  defaultValue?: Value | Value[];
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (value: Value | Value[]) => void;
  options?: (ToggleGroupOption<Value> | Value)[];
  ref?: Ref<HTMLDivElement>;
  size?: ToggleGroupSize;
  style?: CSSProperties;
  styles?: ToggleGroupStyles;
  value?: Value | Value[];
  variant?: ToggleGroupVariant;
}

const ToggleGroup = <Value extends string = string>(props: ToggleGroupProps<Value>) => {
  const {
    className,
    classNames,
    defaultValue,
    disabled = false,
    multiple = false,
    onChange,
    options,
    ref,
    size = 'middle',
    style,
    styles: customStyles,
    value,
    variant = multiple ? 'segmented' : 'outlined',
  } = props as InternalProps<Value>;

  const [innerValues, setInnerValues] = useControlledState<Value[]>(toValueArray(defaultValue), {
    defaultValue: toValueArray(defaultValue),
    onChange: (next) => {
      if (multiple) {
        onChange?.(next);
        return;
      }
      if (next[0] !== undefined) onChange?.(next[0]);
    },
    value: value === undefined ? undefined : toValueArray(value),
  });

  const normalizedOptions = useMemo(
    () => (options ?? []).map((o) => normalizeOption<Value>(o)),
    [options],
  );

  return (
    <ToggleGroupRoot<Value>
      {...toDataAttributes({ size })}
      className={clsx(classNames?.root, className)}
      disabled={disabled}
      multiple={multiple}
      ref={ref}
      style={{ ...style, ...customStyles?.root }}
      value={innerValues}
      variant={variant}
      onValueChange={(next) => {
        // In single mode the pressed item is locked: Base UI reports an empty
        // array when it is clicked again, which must not clear the selection.
        if (!multiple && next.length === 0) return;
        setInnerValues(next);
      }}
    >
      {normalizedOptions.map((opt) => (
        <ToggleGroupItem<Value>
          aria-label={typeof opt.label === 'string' ? opt.label : opt.title}
          className={clsx(classNames?.item, opt.className)}
          disabled={disabled || opt.disabled}
          key={opt.value}
          size={size}
          style={customStyles?.item}
          title={opt.title}
          value={opt.value}
          variant={variant}
        >
          {opt.icon != null && (
            <ToggleGroupItemIcon className={classNames?.itemIcon} style={customStyles?.itemIcon}>
              {opt.icon}
            </ToggleGroupItemIcon>
          )}
          {opt.label != null && (
            <ToggleGroupItemLabel className={classNames?.itemLabel} style={customStyles?.itemLabel}>
              {opt.label}
            </ToggleGroupItemLabel>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  );
};

ToggleGroup.displayName = 'ToggleGroup';

export default ToggleGroup;
