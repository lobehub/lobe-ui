'use client';

import { Slider } from 'antd';
import { isNull } from 'lodash-es';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import InputNumber from '@/Input/InputNumber';

import type { SliderWithInputProps } from './type';

const SliderWithInput = memo<SliderWithInputProps>(
  ({
    step,
    value,
    onChange,
    max,
    min,
    defaultValue,
    size,
    controls,
    gap = 16,
    style,
    className,
    classNames,
    styles,
    disabled,
    ...rest
  }) => {
    const handleOnchange = (value: number | null) => {
      if (Number.isNaN(value) || isNull(value)) return;
      onChange?.(value);
    };

    const { slider: sliderClassName, input: inputClassName, ...restClassNames } = classNames || {};
    const { slider: sliderStyle, input: inputStyle, ...restStyles } = styles || {};

    return (
      <Flexbox
        align={'center'}
        className={className}
        direction={'horizontal'}
        gap={gap}
        style={style}
      >
        <Slider
          className={sliderClassName}
          classNames={restClassNames}
          defaultValue={defaultValue}
          disabled={disabled}
          max={max}
          min={min}
          onChange={handleOnchange}
          step={step}
          style={{ flex: 1, margin: size === 'small' ? 0 : undefined, ...sliderStyle }}
          styles={restStyles}
          tooltip={{ open: false }}
          value={typeof value === 'number' ? value : 0}
          {...rest}
        />
        <InputNumber
          className={inputClassName}
          controls={size !== 'small' || controls}
          defaultValue={defaultValue}
          disabled={disabled}
          max={max}
          min={min}
          onChange={(v) => handleOnchange(Number(v))}
          size={size}
          step={Number.isNaN(step) || isNull(step) ? undefined : step}
          style={{ flex: 1, maxWidth: size === 'small' ? 40 : 64, ...inputStyle }}
          value={typeof value === 'number' ? value : 0}
        />
      </Flexbox>
    );
  },
);

SliderWithInput.displayName = 'SliderWithInput';

export default SliderWithInput;
