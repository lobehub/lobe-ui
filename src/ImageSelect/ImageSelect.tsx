'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';
import Img from '@/Img';

import { useStyles } from './styles';
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

    const { styles, cx } = useStyles();

    return (
      <Flexbox className={className} gap={16} horizontal ref={ref} style={style} {...rest}>
        {options?.map((item) => {
          const isActive = item.value === currentValue;
          return (
            <Flexbox
              align={'center'}
              className={cx(styles.container, isActive && styles.active)}
              gap={4}
              key={item.value}
              onClick={() => setCurrentValue(item.value)}
            >
              <Img
                alt={item.alt || item.value}
                className={cx(styles.img, isActive && styles.imgActive, classNames?.img)}
                height={height}
                src={item.img}
                style={{
                  ...customStyles?.img,
                  height,
                  width,
                }}
                unoptimized={unoptimized}
                width={width}
              />

              <Flexbox align={'center'} gap={4} horizontal>
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
