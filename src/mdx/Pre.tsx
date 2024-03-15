import { createStyles } from 'antd-style';
import { CSSProperties, memo } from 'react';

import Highlighter from '@/Highlighter';
import Snippet from '@/Snippet';
import { FALLBACK_LANG } from '@/hooks/useHighlight';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    margin-block: 1em;
    border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
    box-shadow: inset 0 0 0 1px ${token.colorBorderSecondary};
  `,
  highlight: css`
    pre {
      padding: 1em !important;
    }
  `,
}));

export interface PreProps {
  children: string;
  className?: string;
  fullFeatured?: boolean;
  lang: string;
  style?: CSSProperties;
}

export const Pre = memo<PreProps>(
  ({ fullFeatured, lang = FALLBACK_LANG, children, className, style }) => {
    const { styles, cx } = useStyles();

    return (
      <Highlighter
        className={cx(styles.container, styles.highlight, className)}
        copyButtonSize={{ blockSize: 28, fontSize: 16 }}
        fullFeatured={fullFeatured}
        language={lang}
        style={style}
        type="block"
      >
        {children}
      </Highlighter>
    );
  },
);

export const PreSingleLine = memo<Omit<PreProps, 'fullFeatured'>>(
  ({ lang = FALLBACK_LANG, children, className, style }) => {
    const { cx, styles } = useStyles();

    return (
      <Snippet
        className={cx(styles.container, className)}
        data-code-type="highlighter"
        language={lang}
        style={style}
        type={'block'}
      >
        {children}
      </Snippet>
    );
  },
);

export default Pre;
