'use client';

import { Tooltip as AntdTooltip, TooltipProps as AntdTooltipProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export type TooltipProps = AntdTooltipProps;

const Tooltip = memo<TooltipProps>(({ className, arrow = false, ...rest }) => {
  const { styles, cx } = useStyles();
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  return <AntdTooltip arrow={arrow} overlayClassName={cx(styles.tooltip, className)} trigger={isMobile ? 'click' : 'hover'} {...rest} />;
});

export default Tooltip;
