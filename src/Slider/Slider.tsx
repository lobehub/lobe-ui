'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import clsx from 'clsx';
import { memo, useId, useState } from 'react';

import { a2uiFieldStyles } from '@/internal/a2ui/standardField';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles as a2uiSliderStyles } from './a2uiStyle';
import { sliderMarker } from './marker.stylex';
import { sliderClasses } from './stable';
import { styles } from './style';
import type { SliderProps } from './type';

/** `variant="a2ui"`. Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `Slider`. */
const A2uiSlider = ({
  className,
  classNames,
  defaultValue,
  label,
  min = 0,
  onChange,
  onChangeComplete,
  style,
  styles: customStyles,
  unit,
  value,
  ...rest
}: SliderProps) => {
  const labelId = useId();
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const showValue = label != null || unit != null;
  return (
    <div
      {...toDataAttributes({ variant: 'a2ui' })}
      {...styleProps(
        [a2uiStyles.base, a2uiFieldStyles.base, a2uiSliderStyles.root],
        clsx(sliderClasses(), className),
        style,
      )}
    >
      <div {...styleProps(a2uiSliderStyles.header, sliderClasses('header'))}>
        {label == null ? (
          <span />
        ) : (
          <span id={labelId} {...styleProps(a2uiSliderStyles.label, sliderClasses('label'))}>
            {label}
          </span>
        )}
        <span {...styleProps(a2uiSliderStyles.value, sliderClasses('value'))}>
          {showValue ? (
            <>
              {current}
              {unit == null ? null : <> {unit}</>}
            </>
          ) : null}
        </span>
      </div>
      <BaseSlider.Root
        aria-labelledby={label == null ? undefined : labelId}
        defaultValue={defaultValue}
        min={min}
        value={value}
        onValueCommitted={(next) => onChangeComplete?.(next as number)}
        onValueChange={(next) => {
          setInner(next as number);
          onChange?.(next as number);
        }}
        {...rest}
      >
        <BaseSlider.Control
          {...styleProps(
            a2uiSliderStyles.control,
            clsx(sliderClasses('control'), classNames?.control),
            customStyles?.control,
          )}
        >
          <BaseSlider.Track
            {...styleProps(
              a2uiSliderStyles.track,
              clsx(sliderClasses('track'), classNames?.track),
              customStyles?.track,
            )}
          >
            <BaseSlider.Indicator
              {...styleProps(
                a2uiSliderStyles.indicator,
                clsx(sliderClasses('indicator'), classNames?.indicator),
                customStyles?.indicator,
              )}
            />
            <BaseSlider.Thumb
              {...styleProps(
                a2uiSliderStyles.thumb,
                clsx(sliderClasses('thumb'), classNames?.thumb),
                customStyles?.thumb,
              )}
            />
          </BaseSlider.Track>
        </BaseSlider.Control>
      </BaseSlider.Root>
    </div>
  );
};

const Slider = memo<SliderProps>(
  ({
    className,
    classNames,
    styles: customStyles,
    style,
    onChange,
    onChangeComplete,
    label,
    unit,
    variant = 'default',
    ...rest
  }) =>
    variant === 'a2ui' ? (
      <A2uiSlider
        className={className}
        classNames={classNames}
        label={label}
        style={style}
        styles={customStyles}
        unit={unit}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
        {...rest}
      />
    ) : (
      <BaseSlider.Root
        onValueChange={(value) => onChange?.(value as number)}
        onValueCommitted={(value) => onChangeComplete?.(value as number)}
        {...rest}
        {...styleProps([sliderMarker, styles.root], clsx(sliderClasses(), className), style)}
      >
        <BaseSlider.Control
          {...styleProps(
            styles.control,
            clsx(sliderClasses('control'), classNames?.control),
            customStyles?.control,
          )}
        >
          <BaseSlider.Track
            {...styleProps(
              styles.track,
              clsx(sliderClasses('track'), classNames?.track),
              customStyles?.track,
            )}
          >
            <BaseSlider.Indicator
              {...styleProps(
                styles.indicator,
                clsx(sliderClasses('indicator'), classNames?.indicator),
                customStyles?.indicator,
              )}
            />
            <BaseSlider.Thumb
              {...styleProps(
                [styles.thumb, focusRing.info],
                clsx(sliderClasses('thumb'), classNames?.thumb),
                customStyles?.thumb,
              )}
            />
          </BaseSlider.Track>
        </BaseSlider.Control>
      </BaseSlider.Root>
    ),
);

Slider.displayName = 'Slider';

export default Slider;
