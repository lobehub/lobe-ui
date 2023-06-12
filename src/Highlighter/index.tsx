import { memo } from 'react';

import { CopyButton, Spotlight } from '@/index';
import { DivProps } from '@/types';

import SyntaxHighlighter, { type SyntaxHighlighterProps } from './SyntaxHighlighter';
import { useStyles } from './style';

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
   * @description Whether add spotlight background
   * @default false
   */
  spotlight?: boolean;
  /**
   * @description The theme of the code block
   * @default 'light'
   */
  theme?: 'dark' | 'light';
  /**
   * @description The type of the code block
   * @default 'block'
   */
  type?: 'ghost' | 'block' | 'pure';
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
    spotlight,
    ...props
  }) => {
    const { styles, cx } = useStyles(type);
    const container = cx(styles.container, className);

    return (
      <div className={container} data-code-type="highlighter" style={style} {...props}>
        {spotlight && <Spotlight size={240} />}
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
