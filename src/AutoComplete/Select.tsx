'use client';

import { AutoComplete as AntAutoComplete } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import { AutoCompleteProps } from './type';

const AutoComplete = memo<AutoCompleteProps>(({ variant, shadow, className, ...rest }) => {
  const theme = useTheme();

  return (
    <AntAutoComplete
      className={cx(
        variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
        className,
      )}
      variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
      {...rest}
    />
  );
});

AutoComplete.displayName = 'AutoComplete';

export default AutoComplete;
