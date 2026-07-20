'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { memo, useMemo } from 'react';

import Radio from './Radio';
import type { RadioGroupOption, RadioGroupProps } from './type';

const RadioGroup = memo<RadioGroupProps>(
  ({ options, onChange, gap = 12, horizontal = true, size, textProps, style, ...rest }) => {
    const items = useMemo<RadioGroupOption[]>(
      () =>
        options.map((option) =>
          typeof option === 'string' ? { label: option, value: option } : option,
        ),
      [options],
    );

    return (
      <BaseRadioGroup
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
          <Radio
            disabled={item.disabled}
            key={item.value}
            size={size}
            textProps={textProps}
            value={item.value}
          >
            {item.label}
          </Radio>
        ))}
      </BaseRadioGroup>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
