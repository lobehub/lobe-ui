'use client';

import { cssVar, cx, useTheme } from 'antd-style';
import { AlertOctagon, AlertTriangle, Info, Lightbulb, MessageSquareWarning } from 'lucide-react';
import { type FC, useMemo } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
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
        color: cssVar.colorError,
        icon: AlertOctagon,
      },
      important: {
        background: theme.purpleFillTertiary,
        color: cssVar.purple,
        icon: MessageSquareWarning,
      },
      info: {
        background: theme.colorInfoFillTertiary,
        color: cssVar.colorInfo,
        icon: Info,
      },
      tip: {
        background: theme.colorSuccessFillTertiary,
        color: cssVar.colorSuccess,
        icon: Lightbulb,
      },
      warning: {
        background: theme.colorWarningFillTertiary,
        color: cssVar.colorWarning,
        icon: AlertTriangle,
      },
    }),
    [theme],
  );

  const selectedType = typeConfig?.[type] || typeConfig.info;

  const { icon, color, background } = selectedType;

  return (
    <Flexbox
      horizontal
      align={'flex-start'}
      className={cx(styles.container, className)}
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
