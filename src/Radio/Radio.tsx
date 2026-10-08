'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';

import { styles } from './style';
import type { RadioProps } from './type';

const Radio = memo<RadioProps>(
  ({
    size = 16,
    backgroundColor,
    children,
    className,
    classNames,
    styles: customStyles,
    style,
    textProps,
    disabled,
    ...rest
  }) => {
    const dotStyle: CSSProperties = {
      height: size,
      width: size,
      ...(backgroundColor ? { '--lobe-radio-bg': backgroundColor } : {}),
      ...(children ? {} : style),
      ...customStyles?.radio,
    };

    const dot = (
      <BaseRadio.Root
        disabled={disabled}
        {...rest}
        {...styleProps(
          [styles.root, focusRing.info],
          clsx(children ? classNames?.radio : className, classNames?.radio),
          dotStyle,
        )}
      >
        <BaseRadio.Indicator
          {...stylex.props(styles.indicator)}
          style={{ height: Math.round(size * 0.375), width: Math.round(size * 0.375) }}
        />
      </BaseRadio.Root>
    );

    if (!children) return dot;

    return (
      <label
        {...styleProps(styles.label, clsx(className, classNames?.wrapper), {
          gap: Math.floor(size / 2),
          ...style,
          ...customStyles?.wrapper,
        })}
      >
        {dot}
        <Text
          as={'span'}
          className={classNames?.text}
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

Radio.displayName = 'Radio';

export default Radio;
