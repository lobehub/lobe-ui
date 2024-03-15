import { Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { isString } from 'lodash-es';
import { Info, Lightbulb, MessageSquareWarning, OctagonAlert, TriangleAlert } from 'lucide-react';
import { rgba } from 'polished';
import type { ReactNode } from 'react';
import { FC } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      --lobe-markdown-margin-multiple: 1;

      overflow: hidden;
      gap: 0.75em;

      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-inline: 1em;

      border: 1px solid transparent;
      border-radius: ${token.borderRadius}px;
    `,
    content: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * -1em);

      p {
        color: inherit !important;
      }
    `,
  };
});

export interface CalloutProps {
  children: ReactNode;
  type?: 'tip' | 'error' | 'important' | 'info' | 'warning';
}

const Callout: FC<CalloutProps> = ({ children, type = 'info' }) => {
  const { styles, theme } = useStyles();

  const typeConfig = {
    error: {
      color: theme.colorError,
      icon: OctagonAlert,
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
      icon: TriangleAlert,
    },
  };

  const selectedType = typeConfig?.[type] || typeConfig.info;

  const { icon, color } = selectedType;

  return (
    <Flexbox
      align={'flex-start'}
      className={styles.container}
      horizontal
      style={{
        background: rgba(color, 0.1),
        borderColor: rgba(color, 0.5),
        color,
      }}
    >
      <Icon icon={icon} size={{ fontSize: '1.2em' }} style={{ marginBlock: '0.2em' }} />
      <div className={styles.content}>{isString(children) ? <p>{children}</p> : children}</div>
    </Flexbox>
  );
};

export default Callout;
