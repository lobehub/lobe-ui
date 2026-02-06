'use client';

import { Input as AntInput } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { TextAreaProps } from './type';

const TextArea = memo<TextAreaProps>(
  ({ ref, variant, shadow, className, resize = false, style, ...rest }) => {
    const { isDarkMode } = useThemeMode();

    return (
      <AntInput.TextArea
        ref={ref}
        variant={variant || (isDarkMode ? 'filled' : 'outlined')}
        className={cx(
          variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
        style={{
          resize: resize ? undefined : 'none',
          ...style,
        }}
        {...rest}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
