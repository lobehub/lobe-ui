'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
import Tag from '@/Tag';

import FullFeatured from './FullFeatured';
import SyntaxHighlighter from './SyntaxHighlighter';
import { useStyles } from './style';
import { HighlighterProps } from './type';

export const Highlighter = memo<HighlighterProps>(
  ({
    fullFeatured,
    copyButtonSize = 'site',
    children,
    language = 'markdown',
    className,
    style,
    copyable = true,
    showLanguage = true,
    type = 'block',
    wrap,
    bodyRender,
    actionsRender,
    ...rest
  }) => {
    const { styles, cx } = useStyles(type);

    const originalActions = copyable && (
      <CopyButton content={children} placement="left" size={copyButtonSize} />
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize: copyButtonSize,
          content: children,
          language,
          originalNode: originalActions,
        })
      : originalActions;

    const originalBody = (
      <SyntaxHighlighter language={language?.toLowerCase()}>{children}</SyntaxHighlighter>
    );

    const body = bodyRender
      ? bodyRender({ content: children, language, originalNode: originalBody })
      : originalBody;

    if (fullFeatured)
      return (
        <FullFeatured
          actionsRender={actionsRender}
          bodyRender={bodyRender}
          className={className}
          copyable={copyable}
          language={language}
          showLanguage={showLanguage}
          type={type}
          wrap={wrap}
          {...rest}
        >
          {children}
        </FullFeatured>
      );

    return (
      <div
        className={cx(styles.container, !wrap && styles.nowrap, className)}
        data-code-type="highlighter"
        style={style}
        {...rest}
      >
        <Flexbox align={'center'} className={styles.button} flex={'none'} gap={4} horizontal>
          {actions}
        </Flexbox>
        {showLanguage && language && <Tag className={styles.lang}>{language.toLowerCase()}</Tag>}
        <div className={styles.scroller}>{body}</div>
      </div>
    );
  },
);

export default Highlighter;

export { default as SyntaxHighlighter, type SyntaxHighlighterProps } from './SyntaxHighlighter';
export { type HighlighterProps } from './type';
