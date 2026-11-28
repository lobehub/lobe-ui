'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import clsx from 'clsx';
import { memo, useId, useMemo } from 'react';

import { a2uiFieldStyles } from '@/internal/a2ui/standardField';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles as a2uiRadioStyles } from './a2uiStyle';
import Radio from './Radio';
import { radioGroupClasses } from './stable';
import { styles } from './style';
import type { RadioGroupOption, RadioGroupProps } from './type';

const RadioGroup = memo<RadioGroupProps>(
  ({
    className,
    options,
    onChange,
    gap,
    horizontal = true,
    label,
    optionVariant = 'list',
    size,
    textProps,
    style,
    variant = 'default',
    ...rest
  }) => {
    const labelId = useId();
    const items = useMemo<RadioGroupOption[]>(
      () =>
        options.map((option) =>
          typeof option === 'string' ? { label: option, value: option } : option,
        ),
      [options],
    );

    if (variant === 'a2ui') {
      // Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `RadioGroup`.
      return (
        <div
          {...toDataAttributes({ horizontal, variant })}
          {...styleProps(
            [a2uiStyles.base, a2uiFieldStyles.base, a2uiRadioStyles.group],
            clsx(radioGroupClasses(), className),
            style,
          )}
        >
          {label != null && (
            <div
              id={labelId}
              {...styleProps(
                [a2uiFieldStyles.label, a2uiRadioStyles.legend],
                radioGroupClasses('label'),
              )}
            >
              {label}
            </div>
          )}
          <BaseRadioGroup
            aria-labelledby={label == null ? undefined : labelId}
            {...styleProps(
              [
                a2uiRadioStyles.options,
                optionVariant === 'list' && a2uiRadioStyles.optionsList,
                !horizontal && a2uiRadioStyles.optionsCol,
              ],
              radioGroupClasses('options'),
              gap === undefined ? undefined : { gap },
            )}
            onValueChange={onChange}
            {...rest}
          >
            {items.map((item) => (
              <label
                data-option-variant={optionVariant}
                key={item.value}
                {...styleProps(
                  [
                    a2uiRadioStyles.option,
                    optionVariant === 'pills' && a2uiRadioStyles.optionPills,
                    optionVariant === 'cards' && a2uiRadioStyles.optionCards,
                  ],
                  radioGroupClasses('item'),
                )}
              >
                <Radio disabled={item.disabled} value={item.value} variant="a2ui" />
                <span {...styleProps(a2uiRadioStyles.text)}>
                  <span>{item.label}</span>
                  {item.description != null && (
                    <span
                      {...styleProps(a2uiRadioStyles.description, radioGroupClasses('description'))}
                    >
                      {item.description}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </BaseRadioGroup>
        </div>
      );
    }

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
