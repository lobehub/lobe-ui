'use client';

import { Loader2 } from 'lucide-react';
import { MouseEventHandler, forwardRef, useCallback, useMemo, useState } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import Icon, {
  type IconProps,
  type IconSizeConfig,
  type IconSizeType,
  LucideIconProps,
} from '@/Icon';
import Tooltip, { type TooltipProps } from '@/Tooltip';
import Spotlight from '@/awesome/Spotlight';

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
  classNames?: TooltipProps['classNames'];
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
  overlayClassName?: TooltipProps['overlayClassName'];
  overlayStyle?: TooltipProps['overlayStyle'];
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
  styles?: TooltipProps['styles'];
  /**
   * @description The text shown in the tooltip
   */
  title?: string;
  /**
   * @description Mouse enter delay of tooltip
   * @default 0.5
   */
  tooltipDelay?: number;
  variant?: 'default' | 'block' | 'ghost';
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
      variant = 'default',
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
      disable,
      spin: iconSpinning,
      styles,
      ...rest
    },
    ref,
  ) => {
    const { styles: s, cx } = useStyles({
      active: Boolean(active),
      glass: Boolean(glass),
      variant,
    });
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
      <Icon className={s.icon} icon={icon} {...iconProps} spin={iconSpinning} />
    );

    const spin = <Icon icon={Loader2} {...iconProps} spin />;

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
      (event) => {
        if (loading || disable) return;
        setTooltipOpen(false);
        onClick?.(event);
      },
      [loading, disable, setTooltipOpen, onClick],
    );

    const actionIconBlock = (
      <Flexbox
        align={'center'}
        className={cx(s.block, disable ? s.disabled : s.normal, className)}
        horizontal
        justify={'center'}
        onClick={handleClick}
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
        onOpenChange={setTooltipOpen}
        open={tooltipOpen}
        placement={placement}
        styles={{
          ...styles,
          root: { pointerEvents: 'none', ...styles?.root },
        }}
        title={title}
      >
        {actionIconBlock}
      </Tooltip>
    );
  },
);

export default ActionIcon;
