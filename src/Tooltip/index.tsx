import { Tooltip as AntdTooltip, TooltipProps as AntdTooltipProps } from 'antd';
import { memo } from 'react';
import { useStyles } from './style';

export type TooltipProps = AntdTooltipProps;

const Tooltip = memo<TooltipProps>(({ className, ...props }) => {
  const { styles, cx } = useStyles();
  return <AntdTooltip overlayClassName={cx(styles.tooltip, className)} {...props} />;
});

export default Tooltip;
