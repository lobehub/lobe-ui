import { createStyles } from 'antd-style';
import { CSSProperties, FC, ReactNode } from 'react';

import Highlighter from '@/Highlighter';
import Snippet from '@/Snippet';
import { FALLBACK_LANG } from '@/hooks/useHighlight';

const useStyles = createStyles(({ css }) => ({
  container: css`
    overflow: hidden;
    margin-block: 1em;
    border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
    box-shadow: inset 0 0 0 1px var(--lobe-markdown-border-color);
  `,
  highlight: css`
    pre {
      overflow-x: hidden !important;
      padding: 1em !important;
    }
  `,
}));

export interface PreProps {
  allowChangeLanguage?: boolean;
  children: string;
  className?: string;
  fileName?: string;
  fullFeatured?: boolean;
  icon?: ReactNode;
  lang: string;
  style?: CSSProperties;
}

export const Pre: FC<PreProps> = ({
  fullFeatured,
  fileName,
  allowChangeLanguage,
  lang = FALLBACK_LANG,
  children,
  className,
  style,
  icon,
}) => {
  const { styles, cx } = useStyles();

  return (
    <Highlighter
      allowChangeLanguage={allowChangeLanguage}
      className={cx(styles.container, styles.highlight, className)}
      copyButtonSize={{ blockSize: 28, fontSize: 16 }}
      fileName={fileName}
      fullFeatured={fullFeatured}
      icon={icon}
      language={lang}
      style={style}
      type="block"
    >
      {children}
    </Highlighter>
  );
};

export const PreSingleLine: FC<Omit<PreProps, 'fullFeatured'>> = ({
  lang = FALLBACK_LANG,
  children,
  className,
  style,
}) => {
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
};

export default Pre;
