'use client';

import { Select as AntSelect } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDownIcon } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';

import { variants } from './style';
import type { SelectProps } from './type';

/**
 * @deprecated Use `Select` from `@lobehub/ui/base-ui` instead.
 */
const Select = memo<SelectProps>(
  ({ ref, variant, suffixIconProps, suffixIcon, shadow, className, ...rest }) => {
    const { isDarkMode } = useThemeMode();

    return (
      <AntSelect
        ref={ref}
        variant={variant || (isDarkMode ? 'filled' : 'outlined')}
        className={cx(
          variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
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
        {...rest}
      />
    );
  },
);

Select.displayName = 'Select';

export default Select;
