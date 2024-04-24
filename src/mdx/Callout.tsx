'use client';

import { createStyles } from 'antd-style';
import { AlertOctagon, AlertTriangle, Info, Lightbulb, MessageSquareWarning } from 'lucide-react';
import { rgba } from 'polished';
import { FC } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      --lobe-markdown-margin-multiple: 1;

      overflow: hidden;
      gap: 0.75em;

      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-inline: 1em;

      border: 1px solid transparent;
      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
    `,
    content: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * -1em);

      > div {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      }

      p {
        color: inherit !important;
      }
    `,
    underlineAnchor: css`
      a {
        text-decoration: underline;
      }
    `,
  };
});

export interface CalloutProps extends FlexboxProps {
  type?: 'tip' | 'error' | 'important' | 'info' | 'warning';
}

const Callout: FC<CalloutProps> = ({ children, type = 'info', className, style, ...rest }) => {
  const { cx, styles, theme } = useStyles();

  const typeConfig = {
    error: {
      color: theme.colorError,
      icon: AlertOctagon,
    },
    important: {
      color: theme.purple,
      icon: MessageSquareWarning,
    },
    info: {
      color: theme.colorInfo,
      icon: Info,
    },
    tip: {
      color: theme.colorSuccess,
      icon: Lightbulb,
    },
    warning: {
      color: theme.colorWarning,
      icon: AlertTriangle,
    },
  };

  const selectedType = typeConfig?.[type] || typeConfig.info;

  const { icon, color } = selectedType;

  return (
    <Flexbox
      align={'flex-start'}
      className={cx(styles.container, className)}
      horizontal
      style={{
        background: rgba(color, 0.1),
        borderColor: rgba(color, 0.5),
        color,
        ...style,
      }}
      {...rest}
    >
      <Icon icon={icon} size={{ fontSize: '1.2em' }} style={{ marginBlock: '0.25em' }} />
      <div className={cx(styles.content, type === 'info' && styles.underlineAnchor)}>
        <div>{children}</div>
      </div>
    </Flexbox>
  );
};

export default Callout;
