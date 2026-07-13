'use client';

import { isNull } from 'es-toolkit/compat';
import { memo } from 'react';

import { InputNumber } from '@/base-ui/Input';
import { Flexbox } from '@/Flex';

import Slider from './Slider';
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
    styles: customStyles,
    disabled,
    unlimitedInput = false,
    changeOnWheel,
    shadow,
    variant,
    ...rest
  }) => {
    const handleChange = (next: number | null) => {
      if (isNull(next) || Number.isNaN(next)) return;
      onChange?.(next);
    };

    const {
      slider: sliderClassName,
      input: inputClassName,
      ...sliderPartClassNames
    } = classNames || {};
    const { slider: sliderStyle, input: inputStyle, ...sliderPartStyles } = customStyles || {};

    return (
      <Flexbox horizontal align={'center'} className={className} gap={gap} style={style}>
        <Slider
          className={sliderClassName}
          classNames={sliderPartClassNames}
          defaultValue={defaultValue}
          disabled={disabled}
          max={max}
          min={min}
          step={step}
          style={{ flex: 1, ...sliderStyle }}
          styles={sliderPartStyles}
          value={value}
          onChange={handleChange}
          {...rest}
        />
        <InputNumber
          changeOnWheel={changeOnWheel}
          className={inputClassName}
          controls={size !== 'small' && controls !== false}
          defaultValue={defaultValue}
          disabled={disabled}
          max={unlimitedInput ? undefined : max}
          min={min}
          shadow={shadow}
          size={size}
          step={step === undefined || Number.isNaN(step) ? undefined : step}
          value={value}
          variant={variant}
          style={{
            flex: 'none',
            width: size === 'small' ? 48 : 88,
            ...inputStyle,
          }}
          onChange={handleChange}
        />
      </Flexbox>
    );
  },
);

SliderWithInput.displayName = 'SliderWithInput';

export default SliderWithInput;
