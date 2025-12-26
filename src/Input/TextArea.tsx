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
        className={cx(
          variants({ shadow, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
        ref={ref}
        style={{
          resize: resize ? undefined : 'none',
          ...style,
        }}
        variant={variant || (isDarkMode ? 'filled' : 'outlined')}
        {...rest}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
