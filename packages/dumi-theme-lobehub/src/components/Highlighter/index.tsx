import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { CSSProperties, FC, memo } from 'react';

import { PrismSyntaxTheme } from 'dumi-theme-lobehub/components/Highlighter/Prism';
import { ShikiSyntaxTheme } from 'dumi-theme-lobehub/components/Highlighter/useShiki';
import { useCopied } from '../../hooks/useCopied';
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
    const { styles, theme, cx } = useStyles();
    const container = cx(styles.container, background && styles.withBackground, className);

    return (
      <div
        // 用于标记是 markdown 中的代码块，避免和普通 code 的样式混淆
        data-code-type="highlighter"
        className={container}
        style={style}
      >
        {copyable && (
          <ConfigProvider theme={{ token: { colorBgContainer: theme.colorBgElevated } }}>
            <Tooltip
              placement={'left'}
              arrow={false}
              title={
                copied ? (
                  <>
                    <CheckOutlined style={{ color: theme.colorSuccess }} /> 复制成功
                  </>
                ) : (
                  '复制'
                )
              }
            >
              <Button
                icon={<CopyOutlined />}
                className={styles.button}
                onClick={() => {
                  copy(children);
                  setCopied();
                }}
              />
            </Tooltip>
          </ConfigProvider>
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
