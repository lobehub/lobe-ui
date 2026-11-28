'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';
import { toDataAttributes } from '@/utils/bem';

import { styles as a2uiRadioStyles } from './a2uiStyle';
import { radioClasses } from './stable';
import { styles } from './style';
import type { RadioProps } from './type';

const Radio = memo<RadioProps>(
  ({
    size: sizeProp,
    backgroundColor,
    children,
    className,
    classNames,
    styles: customStyles,
    style,
    textProps,
    disabled,
    variant = 'default',
    ...rest
  }) => {
    if (variant === 'a2ui') {
      // Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `Radio`.
      const a2uiDot = (
        <BaseRadio.Root
          disabled={disabled}
          {...rest}
          {...(children ? undefined : toDataAttributes({ variant }))}
          {...styleProps(
            a2uiRadioStyles.dot,
            clsx(
              !children && radioClasses(),
              radioClasses('radio'),
              children ? classNames?.radio : className,
              classNames?.radio,
            ),
            {
              ...(backgroundColor ? { borderColor: backgroundColor } : {}),
              ...(children ? {} : style),
              ...customStyles?.radio,
            },
          )}
        />
      );
      if (!children) return a2uiDot;
      return (
        <label
          {...toDataAttributes({ variant })}
          {...styleProps(
            [a2uiStyles.base, a2uiRadioStyles.option],
            clsx(radioClasses(), className, classNames?.wrapper),
            { ...style, ...customStyles?.wrapper },
          )}
        >
          {a2uiDot}
          <span className={clsx(radioClasses('text'), classNames?.text)} style={customStyles?.text}>
            {children}
          </span>
        </label>
      );
    }

    const size = sizeProp ?? 16;
    const customSize = sizeProp !== undefined;
    const dotStyle: CSSProperties = {
      ...(customSize && { height: size, width: size }),
      ...(backgroundColor ? { '--lobe-radio-bg': backgroundColor } : {}),
      ...(children ? {} : style),
      ...customStyles?.radio,
    };

    const dot = (
      <BaseRadio.Root
        disabled={disabled}
        {...rest}
        {...styleProps(
          [styles.root, focusRing.info, !customSize && styles.defaultSize],
          clsx(
            !children && radioClasses(),
            radioClasses('radio'),
            children ? classNames?.radio : className,
            classNames?.radio,
          ),
          dotStyle,
        )}
      >
        <BaseRadio.Indicator
          {...styleProps(
            [styles.indicator, !customSize && styles.defaultIndicator],
            radioClasses('indicator'),
            customSize
              ? { height: Math.round(size * 0.375), width: Math.round(size * 0.375) }
              : undefined,
          )}
        />
      </BaseRadio.Root>
    );

    if (!children) return dot;

    return (
      <label
        {...styleProps(styles.label, clsx(radioClasses(), className, classNames?.wrapper), {
          ...(customSize && { gap: Math.floor(size / 2) }),
          ...style,
          ...customStyles?.wrapper,
        })}
      >
        {dot}
        <Text
          as={'span'}
          className={clsx(radioClasses('text'), classNames?.text)}
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
