import { Loader2 } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

import Icon, { type IconProps } from '@/Icon';
import Spotlight from '@/Spotlight';
import Tooltip, { type TooltipProps } from '@/Tooltip';
import { DivProps } from '@/types';

import { useStyles } from './style';

export type ActionIconSize =
  | 'large'
  | 'normal'
  | 'small'
  | 'site'
  | {
      blockSize?: number;
      borderRadius?: number;
      fontSize?: number;
      strokeWidth?: number;
    };

const calcSize = (size?: ActionIconSize) => {
  let blockSize: number;
  let borderRadius: number;

  switch (size) {
    case 'large': {
      blockSize = 44;
      borderRadius = 8;
      break;
    }
    case 'normal': {
      blockSize = 36;
      borderRadius = 5;
      break;
    }
    case 'small': {
      blockSize = 24;
      borderRadius = 5;
      break;
    }
    case 'site': {
      blockSize = 34;
      borderRadius = 5;
      break;
    }
    default: {
      blockSize = size?.blockSize || 36;
      borderRadius = size?.borderRadius || 5;
      break;
    }
  }

  return {
    blockSize,
    borderRadius,
  };
};

export interface ActionIconProps extends DivProps {
  /**
   * @description Whether the icon is active or not
   * @default false
   */
  active?: boolean;
  /**
   * @description Change arrow's visible state and change whether the arrow is pointed at the center of target.
   * @default false
   */
  arrow?: boolean;
  color?: IconProps['color'];
  fill?: IconProps['fill'];
  /**
   * @description Glass blur style
   * @default 'false'
   */
  glass?: boolean;
  /**
   * @description The icon element to be rendered
   * @type LucideIcon
   */
  icon?: IconProps['icon'];
  /**
   * @description Set the loading status of ActionIcon
   */
  loading?: boolean;

  /**
   * @description The position of the tooltip relative to the target
   * @enum ["top","left","right","bottom","topLeft","topRight","bottomLeft","bottomRight","leftTop","leftBottom","rightTop","rightBottom"]
   * @default "top"
   */
  placement?: TooltipProps['placement'];

  /**
   * @description Size of the icon
   * @default 'normal'
   */
  size?: ActionIconSize;
  /**
   * @description Whether add spotlight background
   * @default false
   */
  spotlight?: boolean;
  /**
   * @description The text shown in the tooltip
   */
  title?: string;
  /**
   * @description Mouse enter delay of tooltip
   * @default 0.5
   */
  tooltipDelay?: number;
}

const ActionIcon = forwardRef<HTMLDivElement, ActionIconProps>(
  (
    {
      color,
      fill,
      className,
      active,
      icon,
      size = 'normal',
      style,
      glass,
      title,
      placement,
      arrow = false,
      spotlight,
      onClick,
      children,
      loading,
      tooltipDelay = 0.5,
      ...props
    },
    ref,
  ) => {
    const { styles, cx } = useStyles({ active: Boolean(active), glass: Boolean(glass) });

    const { blockSize, borderRadius } = useMemo(() => calcSize(size), [size]);

    const content = (
      <>
        {icon && (
          <Icon color={color} fill={fill} icon={icon} size={size === 'site' ? 'normal' : size} />
        )}
        {children}
      </>
    );

    const spin = (
      <Icon color={color} icon={Loader2} size={size === 'site' ? 'normal' : size} spin />
    );

    const actionIconBlock = (
      <div
        className={cx(styles.block, className)}
        onClick={loading ? undefined : onClick}
        ref={ref}
        style={{ borderRadius, height: blockSize, width: blockSize, ...style }}
        {...props}
      >
        {spotlight && <Spotlight />}
        {loading ? spin : content}
      </div>
    );

    if (!title) return actionIconBlock;

    return (
      <Tooltip
        arrow={arrow}
        mouseEnterDelay={tooltipDelay}
        overlayStyle={{ pointerEvents: 'none' }}
        placement={placement}
        title={title}
      >
        {actionIconBlock}
      </Tooltip>
    );
  },
);

export default ActionIcon;
