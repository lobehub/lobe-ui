import { useHighlight } from '@/hooks/useHighlight';
import { useThemeMode } from 'antd-style';
import { FC, memo, useEffect } from 'react';
import CopyButton from '../CopyButton';
import SyntaxHighlighter from './SyntaxHighlighter';
import { useStyles } from './style';

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
   * @description Whether to add a background to the code block
   * @default true
   */
  background?: boolean;
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
}

export const Highlighter: FC<HighlighterProps> = memo(
  ({
    children,
    language,
    background = true,
    className,
    style,
    theme,
    copyable = true,
    showLanguage = true,
  }) => {
    const { styles, cx } = useStyles();
    const container = cx(styles.container, background && styles.withBackground, className);
    const { isDarkMode } = useThemeMode();

    useEffect(() => {
      useHighlight.getState().initHighlighter();
    }, []);

    return (
      <div data-code-type="highlighter" className={container} style={style}>
        {copyable && <CopyButton placement="left" content={children} className={styles.button} />}
        {showLanguage && language && <div className={styles.lang}>{language.toLowerCase()}</div>}
        <SyntaxHighlighter
          theme={theme || (isDarkMode ? 'dark' : 'light')}
          language={language?.toLowerCase()}
        >
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    );
  },
);

export default Highlighter;
