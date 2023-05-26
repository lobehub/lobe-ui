import { Icon, Tooltip, TooltipProps } from '@/index';
import { DivProps } from '@/types';
import { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { useStyles } from './style';

export type ActionIconSize =
  | 'large'
  | 'normal'
  | 'small'
  | 'site'
  | {
      blockSize?: number;
      fontSize?: number;
      strokeWidth?: number;
      borderRadius?: number;
    };

export interface ActionIconProps extends DivProps {
  /**
   * @description Whether the icon is active or not
   * @default false
   */
  active?: boolean;
  /**
   * @description Size of the icon
   * @default 'normal'
   */
  size?: ActionIconSize;
  /**
   * @description The icon element to be rendered
   * @type LucideIcon
   */
  icon: LucideIcon;
  /**
   * @description Glass blur style
   * @default 'false'
   */
  glass?: boolean;
  /**
   * @description The text shown in the tooltip
   */
  title?: string;
  /**
   * @description The position of the tooltip relative to the target
   * @enum ["top","left","right","bottom","topLeft","topRight","bottomLeft","bottomRight","leftTop","leftBottom","rightTop","rightBottom"]
   * @default "top"
   */
  placement?: TooltipProps['placement'];
  /**
   * @description Change arrow's visible state and change whether the arrow is pointed at the center of target.
   * @default false
   */
  arrow?: boolean;
}

const ActionIcon = memo<ActionIconProps>(
  ({
    className,
    active,
    icon,
    size = 'normal',
    style,
    glass,
    title,
    placement,
    arrow = false,
    ...props
  }) => {
    const { styles, cx } = useStyles({ active: Boolean(active), glass: Boolean(glass) });
    let blockSize: number;
    let borderRadius: number;
    switch (size) {
      case 'large':
        blockSize = 44;
        borderRadius = 8;
        break;
      case 'normal':
        blockSize = 36;
        borderRadius = 5;
        break;
      case 'small':
        blockSize = 24;
        borderRadius = 5;
        break;
      case 'site':
        blockSize = 34;
        borderRadius = 5;
        break;
      default:
        blockSize = size?.blockSize || 36;
        borderRadius = size?.borderRadius || 5;
        break;
    }

    const actionIconBlock = (
      <div
        className={cx(styles.block, className)}
        style={{ width: blockSize, height: blockSize, borderRadius, ...style }}
        {...props}
      >
        <Icon size={size === 'site' ? 'normal' : size} icon={icon} />
      </div>
    );

    if (!title) return actionIconBlock;

    return (
      <Tooltip arrow={arrow} title={title} placement={placement}>
        {actionIconBlock}
      </Tooltip>
    );
  },
);

export default ActionIcon;
