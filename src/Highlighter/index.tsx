import { memo } from 'react';

import { DivProps } from '@/types';

import CopyButton from '../CopyButton';
import { useStyles } from './style';
import SyntaxHighlighter, { type SyntaxHighlighterProps } from './SyntaxHighlighter';

export { SyntaxHighlighter, SyntaxHighlighterProps };

export interface HighlighterProps extends DivProps {
  /**
   * @description The code content to be highlighted
   */
  children: string;
  /**
   * @description Whether to show the copy button
   * @default true
   */
  copyable?: boolean;
  /**
   * @description The language of the code content
   */
  language: string;
  /**
   * @description Whether to show language tag
   * @default true
   */
  showLanguage?: boolean;
  /**
   * @description The theme of the code block
   * @default 'light'
   */
  theme?: 'dark' | 'light';
  /**
   * @description The type of the code block
   * @default 'block'
   */
  type?: 'ghost' | 'block' | 'prue';
}

export const Highlighter = memo<HighlighterProps>(
  ({
    children,
    language,
    className,
    style,
    theme,
    copyable = true,
    showLanguage = true,
    type = 'block',
  }) => {
    const { styles, cx } = useStyles(type);
    const container = cx(styles.container, className);

    return (
      <div className={container} data-code-type="highlighter" style={style}>
        {copyable && <CopyButton className={styles.button} content={children} placement="left" />}
        {showLanguage && language && <div className={styles.lang}>{language.toLowerCase()}</div>}
        <SyntaxHighlighter language={language?.toLowerCase()} theme={theme}>
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    );
  },
);

export default Highlighter;
