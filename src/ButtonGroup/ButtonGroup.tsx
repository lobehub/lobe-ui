'use client';

import clsx from 'clsx';
import { type KeyboardEvent, memo, useId, useRef } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import PlaygroundField from '@/internal/a2ui/playgroundField';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { buttonGroupClasses } from './stable';
import { styles } from './style';
import type { ButtonGroupOption, ButtonGroupProps } from './type';

const toOption = (option: string | ButtonGroupOption): ButtonGroupOption =>
  typeof option === 'string' ? { value: option } : option;

/**
 * A single choice drawn as a row of joined buttons under a label (a radio group). A lobe-ui look by
 * default, the A2UI playground look with `variant="a2ui"`. Adapted from CopilotKit a2ui-playground
 * (MIT), `renderers/inputs.tsx` ButtonGroup.
 */
const ButtonGroup = memo<ButtonGroupProps>(
  ({
    className,
    classNames,
    defaultValue,
    disabled,
    label,
    onChange,
    options,
    ref,
    style,
    styles: customStyles,
    value,
    variant = 'default',
  }) => {
    const isA2ui = variant === 'a2ui';
    const id = useId();
    const groupRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useControlledState<string | undefined>(undefined, {
      defaultValue,
      onChange: (next) => next !== undefined && onChange?.(next),
      value,
    });
    const items = options.map(toOption);
    const enabled = items.filter((item) => !disabled && !item.disabled);
    const focusValue =
      current !== undefined && enabled.some((i) => i.value === current)
        ? current
        : enabled[0]?.value;

    const pick = (next: string) => {
      if (next !== current) setCurrent(next);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const step = { ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1 }[event.key];
      if (!step || enabled.length === 0) return;
      event.preventDefault();
      const index = enabled.findIndex((item) => item.value === focusValue);
      const next = enabled[(index + step + enabled.length) % enabled.length];
      pick(next.value);
      const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('button[data-value]');
      [...(buttons ?? [])].find((button) => button.dataset.value === next.value)?.focus();
    };

    return (
      <div
        ref={ref}
        {...toDataAttributes({ variant })}
        {...styleProps(undefined, clsx(buttonGroupClasses(), className, classNames?.root), {
          ...style,
          ...customStyles?.root,
        })}
      >
        <PlaygroundField
          htmlFor={id}
          label={label}
          labelClassName={clsx(buttonGroupClasses('label'), classNames?.label)}
          labelStyle={customStyles?.label}
          variant={variant}
        >
          <div
            aria-label={typeof label === 'string' ? label : undefined}
            id={id}
            ref={groupRef}
            role="radiogroup"
            {...styleProps(
              [styles.group, isA2ui ? styles.a2uiGroup : styles.dGroup],
              clsx(buttonGroupClasses('group'), classNames?.group),
              customStyles?.group,
            )}
            onKeyDown={onKeyDown}
          >
            {items.map((item) => {
              const on = item.value === current;
              return (
                <button
                  aria-checked={on}
                  data-value={item.value}
                  disabled={disabled || item.disabled}
                  key={item.value}
                  role="radio"
                  tabIndex={item.value === focusValue ? 0 : -1}
                  type="button"
                  {...toDataAttributes({ checked: on })}
                  {...styleProps(
                    [
                      styles.item,
                      isA2ui ? styles.a2uiItem : styles.dItem,
                      on && (isA2ui ? styles.a2uiItemOn : styles.dItemOn),
                    ],
                    clsx(buttonGroupClasses('item'), classNames?.item),
                    customStyles?.item,
                  )}
                  onClick={() => pick(item.value)}
                >
                  {item.label ?? item.value}
                </button>
              );
            })}
          </div>
        </PlaygroundField>
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
