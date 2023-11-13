import { LucideIcon } from 'lucide-react';
import { memo, useMemo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export type IconSize =
  | 'large'
  | 'normal'
  | 'small'
  | {
      fontSize?: number;
      strokeWidth?: number;
    };

const calcSize = (size?: IconSize) => {
  let fontSize: number | string;
  let strokeWidth: number;

  switch (size) {
    case 'large': {
      fontSize = 24;
      strokeWidth = 2;
      break;
    }
    case 'normal': {
      fontSize = 20;
      strokeWidth = 2;
      break;
    }
    case 'small': {
      fontSize = 14;
      strokeWidth = 1.5;
      break;
    }
    default: {
      if (size) {
        fontSize = size?.fontSize || 24;
        strokeWidth = size?.strokeWidth || 2;
      } else {
        fontSize = '1em';
        strokeWidth = 2;
      }
      break;
    }
  }
  return { fontSize, strokeWidth };
};

export interface IconProps extends DivProps {
  color?: string;
  fill?: string;
  /**
   * @description The icon element to be rendered
   * @type LucideIcon
   */
  icon: LucideIcon;
  /**
   * @description Size of the icon
   * @default 'normal'
   */
  size?: IconSize;
  /**
   * @description Rotate icon with animation
   * @default false
   */
  spin?: boolean;
}

const Icon = memo<IconProps>(({ icon, size, color, fill, className, spin, ...rest }) => {
  const { styles, cx } = useStyles();
  const SvgIcon = icon;

  const { fontSize, strokeWidth } = useMemo(() => calcSize(size), [size]);

  return (
    <span className={cx('anticon', spin && styles.spin, className)} role="img" {...rest}>
      <SvgIcon
        color={color}
        fill={fill ?? 'transparent'}
        focusable={false}
        height={fontSize}
        size={fontSize}
        strokeWidth={strokeWidth}
        width={fontSize}
      />
    </span>
  );
});

export default Icon;
