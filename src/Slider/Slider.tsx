'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import clsx from 'clsx';
import { memo } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { sliderMarker } from './marker.stylex';
import { sliderClasses } from './stable';
import { styles } from './style';
import type { SliderProps } from './type';

const Slider = memo<SliderProps>(
  ({ className, classNames, styles: customStyles, style, onChange, onChangeComplete, ...rest }) => (
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
