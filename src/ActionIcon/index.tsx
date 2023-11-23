import { Loader2 } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

import Icon, { type IconProps, type IconSizeConfig, type IconSizeType } from '@/Icon';
import Spotlight from '@/Spotlight';
import Tooltip, { type TooltipProps } from '@/Tooltip';

import { calcSize } from './calcSize';
import { useStyles } from './style';

interface ActionIconSizeConfig extends IconSizeConfig {
  blockSize?: number;
  borderRadius?: number;
}

type ActionIconSizeType = 'site' | IconSizeType;

export type ActionIconSize = ActionIconSizeType | ActionIconSizeConfig;

export interface ActionIconProps extends Omit<IconProps, 'size' | 'icon'> {
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
  /**
   * @description Glass blur style
   * @default 'false'
   */
  glass?: boolean;
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
      fillOpacity,
      fillRule,
      focusable,
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles({ active: Boolean(active), glass: Boolean(glass) });
    const { blockSize, borderRadius } = useMemo(() => calcSize(size), [size]);

    const iconProps = {
      color,
      fill,
      fillOpacity,
      fillRule,
      focusable,
      size: size === 'site' ? 'normal' : size,
    };

    const content = icon && <Icon className={styles.icon} icon={icon} {...iconProps} />;

    const spin = <Icon icon={Loader2} {...iconProps} spin />;

    const actionIconBlock = (
      <div
        className={cx(styles.block, className)}
        onClick={loading ? undefined : onClick}
        ref={ref}
        style={{ borderRadius, height: blockSize, width: blockSize, ...style }}
        {...rest}
      >
        {spotlight && <Spotlight />}
        {loading ? spin : content}
        {children}
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
