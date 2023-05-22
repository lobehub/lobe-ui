import { LucideIcon } from 'lucide-react';
import React from 'react';

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

const Icon: React.FC<IconProps> = ({ icon, size = 'normal', ...props }) => {
  let fontSize: number;
  let strokeWidth: number;
  const SvgIcon = icon;
  switch (size) {
    case 'large':
    case 'normal':
      fontSize = 24;
      strokeWidth = 2;
      break;
    case 'small':
      fontSize = 20;
      strokeWidth = 1.5;
      break;
    default:
      fontSize = size?.fontSize || 24;
      strokeWidth = size?.strokeWidth || 2;
      break;
  }

  return <SvgIcon size={fontSize} strokeWidth={strokeWidth} {...props} />;
};

export default React.memo(Icon);
