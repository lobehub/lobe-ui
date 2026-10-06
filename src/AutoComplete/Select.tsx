'use client';

import { AutoComplete as AntAutoComplete } from 'antd';
import { memo } from 'react';

import { cx, useThemeMode } from '@/styles';

import { variants } from './style';
import type { AutoCompleteProps } from './type';

const AutoComplete = memo<AutoCompleteProps>(({ variant, shadow, className, ...rest }) => {
  const { isDarkMode } = useThemeMode();

  return (
    <AntAutoComplete
      variant={variant || (isDarkMode ? 'filled' : 'outlined')}
      className={cx(
        variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      {...rest}
    />
  );
});

AutoComplete.displayName = 'AutoComplete';

export default AutoComplete;
