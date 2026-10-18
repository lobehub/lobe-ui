'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { CheckIcon, Minus } from 'lucide-react';
import { type CSSProperties, memo } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';
import { toDataAttributes } from '@/utils/bem';

import { checkboxClasses } from './stable';
import { styles } from './style';
import type { CheckboxProps } from './type';

const Checkbox = memo<CheckboxProps>(
  ({
    size: sizeProp,
    shape = 'square',
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
    ...rest
  }) => {
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
        {box}
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
