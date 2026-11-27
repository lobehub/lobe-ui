'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { CheckIcon, Minus } from 'lucide-react';
import { type CSSProperties, memo } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';
import { toDataAttributes } from '@/utils/bem';

import { styles as a2uiCheckboxStyles } from './a2uiStyle';
import { checkboxClasses } from './stable';
import { styles } from './style';
import type { CheckboxProps } from './type';

const Checkbox = memo<CheckboxProps>(
  ({
    size: sizeProp,
    shape: shapeProp,
    backgroundColor,
    children,
    className,
    classNames,
    styles: customStyles,
    style,
    textProps,
    onChange,
    disabled,
    indeterminate,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const shape = shapeProp ?? (isA2ui ? 'circle' : 'square');

    if (isA2ui) {
      // Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `CheckBox`.
      const a2uiBox = (
        <BaseCheckbox.Root
          disabled={disabled}
          indeterminate={indeterminate}
          onCheckedChange={onChange}
          {...(children ? undefined : toDataAttributes({ shape, variant }))}
          {...rest}
          {...styleProps(
            [
              a2uiCheckboxStyles.box,
              shape === 'square' && a2uiCheckboxStyles.boxSquare,
              !children && a2uiCheckboxStyles.standalone,
            ],
            clsx(
              !children && checkboxClasses(),
              checkboxClasses('checkbox'),
              children ? classNames?.checkbox : className,
              classNames?.checkbox,
            ),
            {
              ...(backgroundColor ? { backgroundColor, borderColor: backgroundColor } : {}),
              ...(children ? {} : style),
              ...customStyles?.checkbox,
            },
          )}
        >
          <BaseCheckbox.Indicator
            {...styleProps(a2uiCheckboxStyles.indicator, checkboxClasses('indicator'))}
          >
            {indeterminate ? (
              <Minus size={14} strokeWidth={3} />
            ) : (
              <CheckIcon size={14} strokeWidth={3} />
            )}
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
      );
      if (!children) return a2uiBox;
      return (
        <label
          {...toDataAttributes({ shape, variant })}
          {...styleProps(
            [a2uiStyles.base, a2uiCheckboxStyles.root, a2uiCheckboxStyles.label],
            clsx(checkboxClasses(), className, classNames?.wrapper),
            { ...style, ...customStyles?.wrapper },
          )}
        >
          {a2uiBox}
          <span
            className={clsx(checkboxClasses('text'), classNames?.text)}
            style={customStyles?.text}
          >
            {children}
          </span>
        </label>
      );
    }

    const size = sizeProp ?? 16;
    const customSize = sizeProp !== undefined;
    const boxStyle: CSSProperties = {
      ...(customSize && { height: size, width: size }),
      ...(customSize &&
        shape === 'square' && { borderRadius: `max(4px, ${Math.round(size / 4)}px)` }),
      ...(backgroundColor ? { '--lobe-checkbox-bg': backgroundColor } : {}),
      ...(children ? {} : style),
      ...customStyles?.checkbox,
    };

    const iconStyle = shape === 'square' ? styles.iconSquare : styles.iconCircle;

    const box = (
      <BaseCheckbox.Root
        disabled={disabled}
        indeterminate={indeterminate}
        onCheckedChange={onChange}
        {...(children ? undefined : toDataAttributes({ shape }))}
        {...rest}
        {...styleProps(
          [
            styles.root,
            focusRing.info,
            !customSize && styles.defaultSize,
            shape === 'square' ? !customSize && styles.defaultSquare : styles.circle,
          ],
          clsx(
            !children && checkboxClasses(),
            checkboxClasses('checkbox'),
            children ? classNames?.checkbox : className,
            classNames?.checkbox,
          ),
          boxStyle,
        )}
      >
        <BaseCheckbox.Indicator {...styleProps(styles.indicator, checkboxClasses('indicator'))}>
          {indeterminate ? (
            <Minus size={size} strokeWidth={3} {...stylex.props(iconStyle)} />
          ) : (
            <CheckIcon size={size} strokeWidth={3} {...stylex.props(iconStyle)} />
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );

    if (!children) return box;

    return (
      <label
        {...toDataAttributes({ shape })}
        {...styleProps(styles.label, clsx(checkboxClasses(), className, classNames?.wrapper), {
          ...(customSize && { gap: Math.floor(size / 2) }),
          ...style,
          ...customStyles?.wrapper,
        })}
      >
        <span
          {...styleProps(styles.control, checkboxClasses('control'), {
            fontSize: customStyles?.text?.fontSize ?? textProps?.fontSize,
            lineHeight: customStyles?.text?.lineHeight ?? textProps?.lineHeight,
          })}
        >
          {box}
        </span>
        <Text
          as={'span'}
          className={clsx(checkboxClasses('text'), classNames?.text)}
          style={customStyles?.text}
          {...textProps}
          type={disabled ? 'secondary' : textProps?.type}
        >
          {children}
        </Text>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Object.assign(Checkbox, { formBinding: { valueProp: 'checked' } as const });
