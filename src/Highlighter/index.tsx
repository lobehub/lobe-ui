import { CSSProperties, FC, memo, useEffect } from 'react';

import { useHighlight } from '@/hooks/useHighlight';
import CopyButton from '../CopyButton';
import SyntaxHighlighter from './Highlighter';
import { useStyles } from './style';

/**
 * 高亮组件的属性
 */
export interface HighlighterProps {
  /**
   * 需要高亮的文本
   */
  children: string;
  /**
   * 语言类型
   */
  language: string;
  /**
   * 是否显示背景容器
   * @default true
   */
  background?: boolean;
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 样式对象
   */
  style?: CSSProperties;
  /**
   * 是否可拷贝
   */
  copyable?: boolean;
  theme?: 'dark' | 'light';
}

export const Highlighter: FC<HighlighterProps> = memo(
  ({ children, language, background = true, className, style, theme, copyable = true }) => {
    const { styles, cx } = useStyles();
    const container = cx(styles.container, background && styles.withBackground, className);

    useEffect(() => {
      useHighlight.getState().initHighlighter();
    }, []);

    return (
      <div
        // 用于标记是 markdown 中的代码块，避免和普通 code 的样式混淆
        data-code-type="highlighter"
        className={container}
        style={style}
      >
        {copyable && <CopyButton content={children} className={styles.button} />}

        {language && <div className={styles.lang}>{language.toLowerCase()}</div>}

        <SyntaxHighlighter theme={theme} language={language?.toLowerCase()}>
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    );
  },
);

export default Highlighter;
