import { memo } from 'react';

import { SvgProps } from '@/types';

import { useStyles } from '../style';

interface FolderIconProps extends SvgProps {
  filetype?: string;
  fontSize?: number;
  hasIcon?: boolean;
  iconColor?: string;
  isMono?: boolean;
  size?: number;
}

const FolderIcon = memo<FolderIconProps>(
  ({ size, isMono, hasIcon, iconColor, filetype, className, fontSize, style, ...rest }) => {
    const { cx, styles, theme } = useStyles();
    return (
      <svg
        className={cx(styles.icon, !hasIcon && className)}
        height={size}
        style={hasIcon ? undefined : style}
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
        />
        {!hasIcon && filetype && (
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
      </svg>
    );
  },
);

export default FolderIcon;
