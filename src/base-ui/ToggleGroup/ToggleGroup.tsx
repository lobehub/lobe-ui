'use client';

import { cx } from 'antd-style';
import { useMemo } from 'react';
import useControlledState from 'use-merge-value';

import {
  ToggleGroupItem,
  ToggleGroupItemIcon,
  ToggleGroupItemLabel,
  ToggleGroupRoot,
} from './atoms';
import type { ToggleGroupOption, ToggleGroupProps } from './type';

const normalizeOption = <Value extends string>(
  option: ToggleGroupOption<Value> | Value,
): ToggleGroupOption<Value> => (typeof option === 'string' ? { value: option } : option);

const ToggleGroup = <Value extends string = string>({
  className,
  classNames,
  defaultValue,
  disabled = false,
  onChange,
  options,
  ref,
  size = 'middle',
  style,
  styles: customStyles,
  value,
  variant = 'outlined',
}: ToggleGroupProps<Value>) => {
  const [innerValue, setInnerValue] = useControlledState<Value | undefined>(defaultValue, {
    defaultValue,
    onChange: (next) => {
      if (next != null) onChange?.(next);
    },
    value,
  });

  const normalizedOptions = useMemo(
    () => (options ?? []).map((o) => normalizeOption<Value>(o)),
    [options],
  );

  const groupValue = useMemo<Value[]>(() => (innerValue != null ? [innerValue] : []), [innerValue]);

  return (
    <ToggleGroupRoot<Value>
      className={cx(classNames?.root, className)}
      disabled={disabled}
      ref={ref}
      style={{ ...style, ...customStyles?.root }}
      value={groupValue}
      variant={variant}
      onValueChange={(next) => {
        const picked = next[0];
        if (picked != null) setInnerValue(picked);
      }}
    >
      {normalizedOptions.map((opt) => (
        <ToggleGroupItem<Value>
          aria-label={typeof opt.label === 'string' ? opt.label : opt.title}
          className={cx(classNames?.item, opt.className)}
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
