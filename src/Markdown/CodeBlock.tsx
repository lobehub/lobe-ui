import Highlighter from '@/Highlighter';
import { createStyles } from 'antd-style';
import { memo } from 'react';

const useStyles = createStyles(
  ({ css }) => css`
    :not(:last-child) {
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
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
      type="block"
      theme={theme.appearance as any}
      language={className?.replace('language-', '') || 'markdown'}
      className={styles}
    >
      {children instanceof Array ? (children[0] as string) : children}
    </Highlighter>
  );
});
export default Code;
