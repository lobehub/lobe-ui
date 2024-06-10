'use client';

import { Loader2 } from 'lucide-react';
import { forwardRef, useMemo } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import Icon, {
  type IconProps,
  type IconSizeConfig,
  type IconSizeType,
  LucideIconProps,
} from '@/Icon';
import Spotlight from '@/Spotlight';
import Tooltip, { type TooltipProps } from '@/Tooltip';

import { calcSize } from './calcSize';
import { useStyles } from './style';

interface ActionIconSizeConfig extends IconSizeConfig {
  blockSize?: number | string;
  borderRadius?: number | string;
}

type ActionIconSizeType = 'site' | IconSizeType;

export type ActionIconSize = ActionIconSizeType | ActionIconSizeConfig;

export interface ActionIconProps extends LucideIconProps, FlexboxProps {
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
  disable?: boolean;
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
  overlayStyle?: CSSProperties;
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
  spin?: boolean;
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
      overlayStyle,
      tooltipDelay = 0.5,
      fillOpacity,
      fillRule,
      focusable,
      disable,
      spin: iconSpinning,
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

    const content = icon && (
      <Icon className={styles.icon} icon={icon} {...iconProps} spin={iconSpinning} />
    );

    const spin = <Icon icon={Loader2} {...iconProps} spin />;

    const actionIconBlock = (
      <Flexbox
        align={'center'}
        className={cx(styles.block, disable ? styles.disabled : styles.normal, className)}
        horizontal
        justify={'center'}
        onClick={loading || disable ? undefined : onClick}
        ref={ref}
        style={{ borderRadius, height: blockSize, width: blockSize, ...style }}
        {...rest}
      >
        {spotlight && <Spotlight />}
        {loading ? spin : content}
        {children}
      </Flexbox>
    );

    if (!title) return actionIconBlock;

    return (
      <Tooltip
        arrow={arrow}
        mouseEnterDelay={tooltipDelay}
        overlayStyle={{ pointerEvents: 'none', ...overlayStyle }}
        placement={placement}
        title={title}
      >
        {actionIconBlock}
      </Tooltip>
    );
  },
);

export default ActionIcon;
