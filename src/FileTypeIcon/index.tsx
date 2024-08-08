'use client';

import { createStyles } from 'antd-style';
import { ReactNode, memo, useMemo } from 'react';
import { Center } from 'react-layout-kit';

import { DivProps, SvgProps } from '@/types';

type IconProps = SvgProps & DivProps;

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;
    `,
    icon: css`
      position: relative;
      flex: none;
      line-height: 1;
    `,
  };
});

export interface FileTypeIconProps extends IconProps {
  color?: string;
  filetype?: string;
  icon?: ReactNode;
  size?: number;
  type?: 'file' | 'folder';
  variant?: 'color' | 'mono';
}

const FileTypeIcon = memo<FileTypeIconProps>(
  ({ icon, color, filetype, type = 'file', size = 48, style, variant, className, ...rest }) => {
    const { cx, styles, theme } = useStyles();
    const filetypeShort = filetype && filetype.length > 4 ? filetype.slice(0, 4) : filetype;
    const fontSize = useMemo(() => {
      if (filetypeShort && filetypeShort.length > 3) {
        return 24 / (4 + (filetypeShort.length - 3));
      }
      return 6;
    }, [filetypeShort]);

    const isMono = variant === 'mono';
    const iconColor = isMono
      ? theme.isDarkMode
        ? theme.colorFill
        : theme.colorBgContainer
      : color || theme.geekblue;

    let content;

    content =
      type === 'file' ? (
        <svg
          className={cx(styles.icon, !icon && className)}
          height={size}
          style={icon ? undefined : style}
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
          {filetypeShort && (
            <text
              fill={isMono ? theme.colorTextSecondary : '#fff'}
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor="middle"
              x="50%"
              y="70%"
            >
              {filetypeShort.toUpperCase()}
            </text>
          )}
          <path
            d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
            fill={'transparent'}
            stroke={theme.colorFillSecondary}
            strokeWidth={0.5}
          ></path>
        </svg>
      ) : (
        <svg
          className={cx(styles.icon, !icon && className)}
          height={size}
          style={icon ? undefined : style}
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
          {!icon && filetype && (
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

    if (!icon) return content;

    return (
      <Center
        className={cx(styles.container, className)}
        flex={'none'}
        height={size}
        style={style}
        width={size}
        {...rest}
      >
        <div
          style={{
            fontSize: size / 2.4,
            position: 'absolute',
            top: type === 'file' ? '20%' : '16%',
            zIndex: 1,
          }}
        >
          {icon}
        </div>
        {content}
      </Center>
    );
  },
);

export default FileTypeIcon;
