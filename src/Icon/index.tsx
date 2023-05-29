import { SvgProps } from '@/types';
import { LucideIcon } from 'lucide-react';
import { FC, memo } from 'react';

export type IconSize =
  | 'large'
  | 'normal'
  | 'small'
  | {
      fontSize?: number;
      strokeWidth?: number;
    };

export interface IconProps extends SvgProps {
  /**
   * @description Size of the icon
   * @default 'normal'
   */
  size?: IconSize;
  /**
   * @description The icon element to be rendered
   * @type LucideIcon
   */
  icon: LucideIcon;
}

const Icon: FC<IconProps> = ({ icon, size, ...props }) => {
  let fontSize: number | string;
  let strokeWidth: number;
  const SvgIcon = icon;
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

  return <SvgIcon size={fontSize} strokeWidth={strokeWidth} {...props} />;
};

export default memo(Icon);
