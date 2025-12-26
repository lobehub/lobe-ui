'use client';

import { Select as AntSelect } from 'antd';
import { cx, useTheme } from 'antd-style';
import { ChevronDownIcon } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { variants } from './style';
import type { SelectProps } from './type';

const Input = memo<SelectProps>(
  ({ ref, variant, suffixIconProps, suffixIcon, shadow, className, ...rest }) => {
    const theme = useTheme();

    return (
      <AntSelect
        className={cx(
          variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
        ref={ref}
        suffixIcon={
          <Icon
            icon={suffixIcon || ChevronDownIcon}
            size={'small'}
            {...suffixIconProps}
            style={{
              pointerEvents: 'none',
              ...suffixIconProps?.style,
            }}
          />
        }
        variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
        {...rest}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
