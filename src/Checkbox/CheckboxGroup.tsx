'use client';

import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { memo, useMemo } from 'react';

import Checkbox from './Checkbox';
import type { CheckboxGroupOption, CheckboxGroupProps } from './type';

const CheckboxGroup = memo<CheckboxGroupProps>(
  ({ options, onChange, gap = 12, horizontal = true, size, shape, textProps, style, ...rest }) => {
    const items = useMemo<CheckboxGroupOption[]>(
      () =>
        options.map((option) =>
          typeof option === 'string' ? { label: option, value: option } : option,
        ),
      [options],
    );

    return (
      <BaseCheckboxGroup
        style={{
          display: 'flex',
          flexDirection: horizontal ? 'row' : 'column',
          flexWrap: 'wrap',
          gap,
          ...style,
        }}
        onValueChange={onChange}
        {...rest}
      >
        {items.map((item) => (
          <Checkbox
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
