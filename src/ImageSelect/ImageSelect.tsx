'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { useControlledState } from '@/hooks/useControlledState';
import Icon from '@/Icon';
import Img from '@/Img';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { imageSelectClasses } from './stable';
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
    width,
    height,
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
      <Flexbox
        horizontal
        className={clsx(imageSelectClasses(), className)}
        gap={16}
        ref={ref}
        style={style}
        {...rest}
      >
        {options?.map((item) => {
          const isActive = item.value === currentValue;
          return (
            <Flexbox
              align={'center'}
              gap={4}
              key={item.value}
              {...toDataAttributes({ active: isActive })}
              {...styleProps(
                [styles.container, isActive && styles.active],
                imageSelectClasses('item'),
              )}
              onClick={() => setCurrentValue(item.value)}
            >
              <Img
                alt={item.alt || item.value}
                height={height ?? 86}
                src={item.img}
                unoptimized={unoptimized}
                width={width ?? 144}
                {...styleProps(
                  [styles.img, isActive && styles.imgActive],
                  clsx(imageSelectClasses('img'), classNames?.img),
                  {
                    ...customStyles?.img,
                    ...(height !== undefined && { height }),
                    ...(width !== undefined && { width }),
                  },
                )}
              />

              <Flexbox horizontal align={'center'} className={imageSelectClasses('label')} gap={4}>
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
