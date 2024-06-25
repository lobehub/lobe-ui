'use client';

import { useTheme } from 'antd-style';
import { memo, useMemo } from 'react';

import { DivProps, SvgProps } from '@/types';

export interface FileTypeIconProps extends SvgProps {
  color?: string;
  filetype?: string;
  size?: number;
  type?: 'file' | 'folder';
  variant?: 'color' | 'mono';
}

const FileTypeIcon = memo<FileTypeIconProps & DivProps>(
  ({ color, filetype, type = 'file', size = 48, style, variant, ...rest }) => {
    const theme = useTheme();
    const fontSize = useMemo(() => {
      if (filetype && filetype.length > 3) {
        return 24 / (4 + (filetype.length - 3));
      }
      return 6;
    }, [filetype]);

    const isMono = variant === 'mono';
    const iconColor = isMono
      ? theme.isDarkMode
        ? theme.colorFill
        : theme.colorBgContainer
      : color || theme.geekblue;

    if (type === 'file')
      return (
        <svg
          height={size}
          style={{ flex: 'none', lineHeight: 1, ...style }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
          {...rest}
        >
          <path
            d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
            fill={iconColor}
          ></path>
          <path
            d="M14 2l6 6h-4a2 2 0 01-2-2V2z"
            fill={isMono ? theme.colorFill : '#fff'}
            fillOpacity=".5"
          ></path>
          {filetype && (
            <text
              fill={isMono ? theme.colorTextSecondary : '#fff'}
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor="middle"
              x="50%"
              y="70%"
            >
              {filetype.toUpperCase()}
            </text>
          )}
          <path
            d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
            fill={'transparent'}
            stroke={theme.colorFillSecondary}
            strokeWidth={0.5}
          ></path>
        </svg>
      );

    return (
      <svg
        height={size}
        style={{ flex: 'none', lineHeight: 1, ...style }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path
          d="M10.46 5.076l-.92-.752A1.446 1.446 0 008.626 4H3.429c-.38 0-.743.147-1.01.41A1.386 1.386 0 002 5.4v13.2c0 .371.15.727.418.99.268.262.632.41 1.01.41h17.143c.38 0 .743-.148 1.01-.41.268-.263.419-.619.419-.99V6.8c0-.371-.15-.727-.418-.99a1.444 1.444 0 00-1.01-.41h-9.198c-.334 0-.657-.115-.914-.324z"
          fill={iconColor}
          stroke={theme.colorFillSecondary}
          strokeWidth={0.5}
        ></path>
        {filetype && (
          <text
            fill={isMono ? theme.colorTextSecondary : '#fff'}
            fontSize={fontSize}
            fontWeight="bold"
            textAnchor="middle"
            x={'50%'}
            y="70%"
          >
            {filetype.toUpperCase()}
          </text>
        )}
      </svg>
    );
  },
);

export default FileTypeIcon;
