import { InputNumber, type InputNumberProps, Slider } from 'antd';
import { SliderSingleProps } from 'antd/es/slider';
import { isNull } from 'lodash-es';
import { memo, useCallback } from 'react';
import { CommonSpaceNumber, Flexbox } from 'react-layout-kit';

export interface SliderWithInputProps extends SliderSingleProps {
  controls?: InputNumberProps['controls'];
  gap?: CommonSpaceNumber | number;
  size?: InputNumberProps['size'];
}

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
    gap,
    style,
    className,
    disabled,
    ...rest
  }) => {
    const handleOnchange = useCallback((value: number | null) => {
      if (Number.isNaN(value) || isNull(value)) return;
      onChange?.(value);
    }, []);

    return (
      <Flexbox
        align={'center'}
        className={className}
        direction={'horizontal'}
        gap={gap ?? 8}
        style={style}
      >
        <Slider
          defaultValue={defaultValue}
          disabled={disabled}
          max={max}
          min={min}
          onChange={handleOnchange}
          step={step}
          style={size === 'small' ? { flex: 1, margin: 0 } : { flex: 1 }}
          tooltip={{ open: false }}
          value={typeof value === 'number' ? value : 0}
          {...rest}
        />
        <InputNumber
          controls={size !== 'small' || controls}
          defaultValue={defaultValue}
          disabled={disabled}
          max={max}
          min={min}
          onChange={handleOnchange}
          size={size}
          step={Number.isNaN(step) || isNull(step) ? undefined : step}
          style={{ flex: 1, maxWidth: size === 'small' ? 40 : 64 }}
          value={typeof value === 'number' ? value : 0}
        />
      </Flexbox>
    );
  },
);

export default SliderWithInput;
