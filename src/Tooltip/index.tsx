import { Tooltip as AntdTooltip, type TooltipProps } from 'antd';
import React from 'react';
import { useStyles } from './style';

export type { TooltipProps };

const Tooltip: React.FC<TooltipProps> = ({ className, ...props }) => {
  const { styles, cx } = useStyles();
  return <AntdTooltip overlayClassName={cx(styles.tooltip, className)} {...props} />;
};

export default React.memo(Tooltip);
