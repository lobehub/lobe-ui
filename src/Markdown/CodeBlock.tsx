import Highlighter from '@/Highlighter';
import { createStyles } from 'antd-style';
import { memo } from 'react';

const useStyles = createStyles(
  ({ css }) => css`
    :not(:last-child) {
      margin-bottom: 14px;
    }
  `,
);

const Code = memo((props: any) => {
  const { styles, theme } = useStyles();
  if (!props.children[0]) return null;

  const { children, className } = props.children[0].props;

  if (!children) return null;

  return (
    <Highlighter
      theme={theme.appearance as any}
      language={className?.replace('language-', '') || 'markdown'}
      className={styles}
    >
      {children instanceof Array ? (children[0] as string) : children}
    </Highlighter>
  );
});
export default Code;
