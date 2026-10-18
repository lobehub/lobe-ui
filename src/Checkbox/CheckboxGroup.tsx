'use client';

import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import clsx from 'clsx';
import { memo, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import Checkbox from './Checkbox';
import { checkboxGroupClasses } from './stable';
import { styles } from './style';
import type { CheckboxGroupOption, CheckboxGroupProps } from './type';

const CheckboxGroup = memo<CheckboxGroupProps>(
  ({
    className,
    options,
    onChange,
    gap,
    horizontal = true,
    size,
    shape,
    textProps,
    style,
    ...rest
  }) => {
    const items = useMemo<CheckboxGroupOption[]>(
      () =>
        options.map((option) =>
          typeof option === 'string' ? { label: option, value: option } : option,
        ),
      [options],
    );

    return (
      <BaseCheckboxGroup
        {...toDataAttributes({ horizontal })}
        {...styleProps(
          [styles.group, !horizontal && styles.groupVertical],
          clsx(checkboxGroupClasses(), className),
          { ...(gap !== undefined && { gap }), ...style },
        )}
        onValueChange={onChange}
        {...rest}
      >
        {items.map((item) => (
          <Checkbox
            className={checkboxGroupClasses('item')}
            disabled={item.disabled}
            key={item.value}
            name={item.value}
            shape={shape}
            size={size}
            textProps={textProps}
            value={item.value}
          >
            {item.label}
          </Checkbox>
        ))}
      </BaseCheckboxGroup>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
