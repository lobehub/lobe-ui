import { LucideIcon } from 'lucide-react';
import { memo } from 'react';

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

export interface IconProps extends DivProps {
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

const Icon = memo<IconProps>(({ icon, size, style, className, spin, ...props }) => {
  const { styles, cx } = useStyles();
  const SvgIcon = icon;

  let fontSize: number | string;
  let strokeWidth: number;

  switch (size) {
    case 'large':
      fontSize = 24;
      strokeWidth = 2;
      break;
    case 'normal':
      fontSize = 20;
      strokeWidth = 2;
      break;
    case 'small':
      fontSize = 14;
      strokeWidth = 1.5;
      break;
    default:
      if (size) {
        fontSize = size?.fontSize || 24;
        strokeWidth = size?.strokeWidth || 2;
      } else {
        fontSize = '1em';
        strokeWidth = 2;
      }

      break;
  }

  return (
    <div
      className={cx(spin && styles.spin, className)}
      style={{ width: fontSize, height: fontSize, ...style }}
      {...props}
    >
      <SvgIcon size={fontSize} strokeWidth={strokeWidth} />
    </div>
  );
});

export default Icon;
