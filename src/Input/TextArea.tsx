'use client';

import { Input as AntInput } from 'antd';
import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { TextAreaProps } from './type';

const TextArea = memo<TextAreaProps>(
  ({ ref, variant, shadow, className, resize = false, style, ...rest }) => {
    const theme = useTheme();

    return (
      <AntInput.TextArea
        className={cx(
          variants({ shadow, variant: variant || (theme.isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
        ref={ref}
        style={{
          resize: resize ? undefined : 'none',
          ...style,
        }}
        variant={variant || (theme.isDarkMode ? 'filled' : 'outlined')}
        {...rest}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
