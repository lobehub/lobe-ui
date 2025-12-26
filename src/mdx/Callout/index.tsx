'use client';

import { cx, useTheme } from 'antd-style';
import { AlertOctagon, AlertTriangle, Info, Lightbulb, MessageSquareWarning } from 'lucide-react';
import { FC, useMemo } from 'react';

import { Flexbox, FlexboxProps } from '@/Flex';
import Icon from '@/Icon';

import { styles } from './style';

export interface CalloutProps extends FlexboxProps {
  type?: 'tip' | 'error' | 'important' | 'info' | 'warning';
}

const Callout: FC<CalloutProps> = ({ children, type = 'info', className, style, ...rest }) => {
  const theme = useTheme();

  const typeConfig = useMemo(
    () => ({
      error: {
        background: theme.colorErrorFillTertiary,
        color: theme.colorError,
        icon: AlertOctagon,
      },
      important: {
        background: theme.purpleFillTertiary,
        color: theme.purple,
        icon: MessageSquareWarning,
      },
      info: {
        background: theme.colorInfoFillTertiary,
        color: theme.colorInfo,
        icon: Info,
      },
      tip: {
        background: theme.colorSuccessFillTertiary,
        color: theme.colorSuccess,
        icon: Lightbulb,
      },
      warning: {
        background: theme.colorWarningFillTertiary,
        color: theme.colorWarning,
        icon: AlertTriangle,
      },
    }),
    [theme],
  );

  const selectedType = typeConfig?.[type] || typeConfig.info;

  const { icon, color, background } = selectedType;

  return (
    <Flexbox
      align={'flex-start'}
      className={cx(styles.container, className)}
      horizontal
      style={{
        background: background,
        boxShadow: `0 0 0 1px ${background} inset`,
        color,
        ...style,
      }}
      {...rest}
    >
      <Icon icon={icon} size={{ size: '1.2em' }} style={{ marginBlock: '0.25em' }} />
      <div className={cx(styles.content, type === 'info' && styles.underlineAnchor)}>
        <div>{children}</div>
      </div>
    </Flexbox>
  );
};

Callout.displayName = 'MdxCallout';

export default Callout;
