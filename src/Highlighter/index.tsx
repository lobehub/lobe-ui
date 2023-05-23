import { memo } from 'react';
import CopyButton from '../CopyButton';
import SyntaxHighlighter from './SyntaxHighlighter';
import { useStyles } from './style';

export { SyntaxHighlighter };

export interface HighlighterProps extends DivProps {
  /**
   * @description The code content to be highlighted
   */
  children: string;
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
   * @description Whether to show the copy button
   * @default true
   */
  copyable?: boolean;
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
      <div data-code-type="highlighter" className={container} style={style}>
        {copyable && <CopyButton placement="left" content={children} className={styles.button} />}
        {showLanguage && language && <div className={styles.lang}>{language.toLowerCase()}</div>}
        <SyntaxHighlighter theme={theme} language={language?.toLowerCase()}>
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    );
  },
);

export default Highlighter;
