'use client';

import { SelectProps } from 'antd';
import { type CSSProperties, ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon, { IconProps } from '@/Icon';
import Img from '@/Img';

import { useStyles } from './styles';

export interface ImageSelectItem {
  alt?: string;
  icon?: IconProps['icon'];
  img: string;
  label: ReactNode;
  value: string;
}

export interface ImageSelectProps extends FlexboxProps {
  className?: string;
  classNames?: {
    img?: string;
  };
  defaultValue?: SelectProps['defaultValue'];
  height?: number;
  onChange?: (value: this['value']) => void;
  options?: ImageSelectItem[];
  style?: CSSProperties;
  styles?: {
    img?: CSSProperties;
  };
  unoptimized?: boolean;
  value?: SelectProps['value'];
  width?: number;
}

const ImageSelect = forwardRef<HTMLDivElement, ImageSelectProps>(
  (
    {
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
    },
    ref,
  ) => {
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
