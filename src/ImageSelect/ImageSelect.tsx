'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';
import useControlledState from 'use-merge-value';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Img from '@/Img';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './styles';
import type { ImageSelectProps } from './type';

const ImageSelect = memo<ImageSelectProps>(
  ({
    ref,
    className,
    style,
    value,
    defaultValue,
    onChange,
    options,
    width = 144,
    height = 86,
    styles: customStyles,
    classNames,
    unoptimized,
    ...rest
  }) => {
    const [currentValue, setCurrentValue] = useControlledState<string>(defaultValue, {
      defaultValue,
      onChange,
      value,
    });

    return (
      <Flexbox horizontal className={className} gap={16} ref={ref} style={style} {...rest}>
        {options?.map((item) => {
          const isActive = item.value === currentValue;
          return (
            <Flexbox
              align={'center'}
              gap={4}
              {...stylex.props(styles.container, isActive && styles.active)}
              key={item.value}
              onClick={() => setCurrentValue(item.value)}
            >
              <Img
                alt={item.alt || item.value}
                height={height}
                src={item.img}
                unoptimized={unoptimized}
                width={width}
                {...styleProps([styles.img, isActive && styles.imgActive], classNames?.img, {
                  ...customStyles?.img,
                  height,
                  width,
                })}
              />

              <Flexbox horizontal align={'center'} gap={4}>
                {item.icon && <Icon icon={item.icon} />}
                {item.label}
              </Flexbox>
            </Flexbox>
          );
        })}
      </Flexbox>
    );
  },
);

ImageSelect.displayName = 'ImageSelect';

export default ImageSelect;
