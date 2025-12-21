import { type FC } from 'react';

import { SvgProps } from '@/types';

import { useStyles } from '../style';

interface FileIconProps extends SvgProps {
  filetypeShort?: string;
  fontSize?: number;
  hasIcon?: boolean;
  iconColor?: string;
  isMono?: boolean;
  size?: number;
}

const FileIcon: FC<FileIconProps> = ({
  size,
  isMono,
  hasIcon,
  iconColor,
  filetypeShort,
  className,
  fontSize,
  style,
  ...rest
}) => {
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
      <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" fill={iconColor} />
      <path
        d="M14 2l6 6h-4a2 2 0 01-2-2V2z"
        fill={isMono ? theme.colorFill : '#fff'}
        fillOpacity=".5"
      />
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
      />
    </svg>
  );
};

export default FileIcon;
