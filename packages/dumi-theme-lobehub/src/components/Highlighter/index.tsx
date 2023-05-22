import { PrismSyntaxTheme } from '@/components/Highlighter/Prism';
import { ShikiSyntaxTheme } from '@/components/Highlighter/useShiki';
import { useCopied } from '@/hooks/useCopied';
import { ActionIcon, Tooltip } from '@lobehub/ui';
import copy from 'copy-to-clipboard';
import { Copy } from 'lucide-react';
import { CSSProperties, FC, memo } from 'react';
import SyntaxHighlighter from './Highlighter';
import { LanguageKeys } from './language';
import { useStyles } from './style';
export { Prism } from './Prism';

export interface HighlighterSyntaxTheme {
  shiki?: Partial<ShikiSyntaxTheme>;
  prism?: Partial<PrismSyntaxTheme>;
}
/**
 * 语法高亮器的属性
 */
export interface HighlighterProps {
  /**
   * 需要进行语法高亮的文本内容
   */
  children: string;
  /**
   * 语言类型，可以是语言的字符串标识或者枚举类型
   */
  language: LanguageKeys | string;
  /**
   * 语法高亮器的类型
   * @default 'shiki'
   */
  type?: 'shiki' | 'prism';
  /**
   * 是否显示背景容器
   * @default true
   */
  background?: boolean;
  /**
   * 组件的类名
   */
  className?: string;
  /**
   * 是否移除前置与后置的空格
   * @default true
   */
  trim?: boolean;
  /**
   * 组件的样式
   */
  style?: CSSProperties;
  /**
   * 语法高亮器的主题
   */
  syntaxThemes?: HighlighterSyntaxTheme;
  /**
   * 是否可拷贝
   */
  copyable?: boolean;
}

export const Highlighter: FC<HighlighterProps> = memo(
  ({
    children,
    language,
    background = true,
    type,
    className,
    style,
    trim = true,
    syntaxThemes,
    copyable = true,
  }) => {
    const { copied, setCopied } = useCopied();
    const { styles, cx } = useStyles();
    const container = cx(styles.container, background && styles.withBackground, className);

    return (
      <div data-code-type="highlighter" className={container} style={style}>
        {copyable && (
          <Tooltip placement={'left'} arrow={false} title={copied ? '✅ Success' : 'Copy'}>
            <ActionIcon
              size="site"
              icon={Copy}
              className={styles.button}
              onClick={() => {
                copy(children);
                setCopied();
              }}
            />
          </Tooltip>
        )}

        {language && <div className={styles.lang}>{language.toLowerCase()}</div>}

        <SyntaxHighlighter
          language={language?.toLowerCase()}
          type={type}
          syntaxThemes={syntaxThemes}
        >
          {trim ? children.trim() : children}
        </SyntaxHighlighter>
      </div>
    );
  },
);

export default Highlighter;
