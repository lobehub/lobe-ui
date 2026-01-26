'use client';

import { Select as AntSelect } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDownIcon } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { variants } from './style';
import type { SelectProps } from './type';

/**
 * @deprecated Use `LobeSelect` instead.
 */
const Select = memo<SelectProps>(
  ({ ref, variant, suffixIconProps, suffixIcon, shadow, className, ...rest }) => {
    const { isDarkMode } = useThemeMode();

    return (
      <AntSelect
        className={cx(
          variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
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
        variant={variant || (isDarkMode ? 'filled' : 'outlined')}
        {...rest}
      />
    );
  },
);

Select.displayName = 'Select';

export default Select;
