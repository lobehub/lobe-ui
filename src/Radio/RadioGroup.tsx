'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import clsx from 'clsx';
import { memo, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import Radio from './Radio';
import { radioGroupClasses } from './stable';
import { styles } from './style';
import type { RadioGroupOption, RadioGroupProps } from './type';

const RadioGroup = memo<RadioGroupProps>(
  ({ className, options, onChange, gap, horizontal = true, size, textProps, style, ...rest }) => {
    const items = useMemo<RadioGroupOption[]>(
      () =>
        options.map((option) =>
          typeof option === 'string' ? { label: option, value: option } : option,
        ),
      [options],
    );

    return (
      <BaseRadioGroup
        {...toDataAttributes({ horizontal })}
        {...styleProps(
          [styles.group, !horizontal && styles.groupVertical],
          clsx(radioGroupClasses(), className),
          { ...(gap !== undefined && { gap }), ...style },
        )}
        onValueChange={onChange}
        {...rest}
      >
        {items.map((item) => (
          <Radio
            className={radioGroupClasses('item')}
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
