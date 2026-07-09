'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cx } from 'antd-style';
import { memo } from 'react';

import { styles } from './style';
import type { SliderProps } from './type';

const Slider = memo<SliderProps>(
  ({ className, classNames, styles: customStyles, style, onChange, onChangeComplete, ...rest }) => (
    <BaseSlider.Root
      className={cx(styles.root, className)}
      style={style}
      onValueChange={(value) => onChange?.(value as number)}
      onValueCommitted={(value) => onChangeComplete?.(value as number)}
      {...rest}
    >
      <BaseSlider.Control
        className={cx(styles.control, classNames?.control)}
        style={customStyles?.control}
      >
        <BaseSlider.Track
          className={cx(styles.track, classNames?.track)}
          style={customStyles?.track}
        >
          <BaseSlider.Indicator
            className={cx(styles.indicator, classNames?.indicator)}
            style={customStyles?.indicator}
          />
          <BaseSlider.Thumb
            className={cx(styles.thumb, classNames?.thumb)}
            style={customStyles?.thumb}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  ),
);

Slider.displayName = 'Slider';

export default Slider;
