'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { cx } from 'antd-style';
import { type CSSProperties, memo } from 'react';

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
        className={cx(styles.root, children ? classNames?.radio : className, classNames?.radio)}
        disabled={disabled}
        style={dotStyle}
        {...rest}
      >
        <BaseRadio.Indicator
          className={styles.indicator}
          style={{ height: Math.round(size * 0.375), width: Math.round(size * 0.375) }}
        />
      </BaseRadio.Root>
    );

    if (!children) return dot;

    return (
      <label
        className={cx(styles.label, className, classNames?.wrapper)}
        style={{ gap: Math.floor(size / 2), ...style, ...customStyles?.wrapper }}
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
