'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { memo, useId } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import chipSelectMessages from '@/i18n/resources/en/chipSelect';
import { useTranslation } from '@/i18n/useTranslation';
import PlaygroundField from '@/internal/a2ui/playgroundField';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { chipSelectClasses } from './stable';
import { styles } from './style';
import type { ChipSelectOption, ChipSelectProps } from './type';

const toOption = (option: string | ChipSelectOption): ChipSelectOption =>
  typeof option === 'string' ? { value: option } : option;

/**
 * A multi-select row of chips under a label, with an "N selected" counter. A lobe-ui look by
 * default, the A2UI playground chips with `variant="a2ui"`. Adapted from CopilotKit
 * a2ui-playground (MIT), `renderers/inputs.tsx` ChipSelect.
 */
const ChipSelect = memo<ChipSelectProps>(
  ({
    className,
    classNames,
    defaultValue,
    disabled,
    label,
    onChange,
    options,
    ref,
    showCount = true,
    style,
    styles: customStyles,
    texts,
    value,
    variant = 'default',
  }) => {
    const isA2ui = variant === 'a2ui';
    const id = useId();
    const { t } = useTranslation(chipSelectMessages);
    const [picked, setPicked] = useControlledState<string[]>([], {
      defaultValue,
      onChange,
      value,
    });
    const selected = Array.isArray(picked) ? picked : [];
    const count =
      showCount && selected.length > 0
        ? (texts?.selected ?? t('chipSelect.selected')).replace('{count}', String(selected.length))
        : null;

    const toggle = (optionValue: string) => {
      const next = selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : // Keep the options' order, like the official toggle group.
          options
            .map(toOption)
            .map((o) => o.value)
            .filter((v) => v === optionValue || selected.includes(v));
      setPicked(next);
    };

    return (
      <div
        ref={ref}
        {...toDataAttributes({ variant })}
        {...styleProps(undefined, clsx(chipSelectClasses(), className, classNames?.root), {
          ...style,
          ...customStyles?.root,
        })}
      >
        <PlaygroundField
          htmlFor={id}
          label={label}
          labelClassName={clsx(chipSelectClasses('label'), classNames?.label)}
          labelStyle={customStyles?.label}
          variant={variant}
          right={
            count && (
              <span
                {...styleProps(
                  isA2ui ? styles.a2uiCount : styles.dCount,
                  chipSelectClasses('count'),
                )}
              >
                {count}
              </span>
            )
          }
        >
          <div
            aria-label={typeof label === 'string' ? label : undefined}
            id={id}
            role="group"
            {...styleProps(
              styles.chips,
              clsx(chipSelectClasses('chips'), classNames?.chips),
              customStyles?.chips,
            )}
          >
            {options.map(toOption).map((option) => {
              const on = selected.includes(option.value);
              return (
                <button
                  aria-pressed={on}
                  disabled={disabled || option.disabled}
                  key={option.value}
                  type="button"
                  {...toDataAttributes({ checked: on })}
                  {...styleProps(
                    [
                      styles.chip,
                      isA2ui ? styles.a2uiChip : styles.dChip,
                      on && (isA2ui ? styles.a2uiChipOn : styles.dChipOn),
                    ],
                    clsx(chipSelectClasses('chip'), classNames?.chip),
                    customStyles?.chip,
                  )}
                  onClick={() => toggle(option.value)}
                >
                  {on && (
                    <Check
                      aria-hidden
                      className={chipSelectClasses('check')}
                      size={12}
                      strokeWidth={2.75}
                    />
                  )}
                  {option.label ?? option.value}
                </button>
              );
            })}
          </div>
        </PlaygroundField>
      </div>
    );
  },
);

ChipSelect.displayName = 'ChipSelect';

export default ChipSelect;
