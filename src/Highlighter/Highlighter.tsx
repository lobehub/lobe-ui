'use client';

import { cva } from 'class-variance-authority';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
import { getCodeLanguageDisplayName } from '@/Highlighter/const';
import Tag from '@/Tag';

import FullFeatured from './FullFeatured';
import SyntaxHighlighter from './SyntaxHighlighter';
import { useStyles } from './style';
import type { HighlighterProps } from './type';

export const Highlighter = memo<HighlighterProps>(
  ({
    animated,
    fullFeatured,
    actionIconSize,
    children,
    language = 'markdown',
    className,
    classNames,
    styles: customStyles,
    copyable = true,
    showLanguage = true,
    variant = 'filled',
    shadow,
    wrap,
    bodyRender,
    actionsRender,
    enableTransformer,
    theme,
    icon,
    fileName,
    allowChangeLanguage,
    defaultExpand = true,
    ...rest
  }) => {
    const { styles, cx } = useStyles();
    const [lang, setLang] = useState(language);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'filled',
            wrap: false,
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
            wrap: {
              false: styles.nowrap,
              true: styles.wrap,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    // Safely handle children with boundary check
    const tirmedChildren = useMemo(() => {
      if (children === null || children === undefined) return '';
      if (typeof children !== 'string') {
        console.warn('Highlighter: children should be a string, received:', typeof children);
        return String(children);
      }
      return children.trim();
    }, [children]);

    const copyContentRef = useRef(tirmedChildren);

    useEffect(() => {
      copyContentRef.current = tirmedChildren;
    }, [tirmedChildren]);

    const getCopyContent = useCallback(() => copyContentRef.current, []);

    const originalActions = useMemo(() => {
      if (!copyable) return null;
      return <CopyButton content={getCopyContent} glass size={actionIconSize} />;
    }, [actionIconSize, copyable, getCopyContent]);

    const actions = useMemo(() => {
      if (!actionsRender) return originalActions;
      return actionsRender({
        actionIconSize,
        content: tirmedChildren,
        getContent: getCopyContent,
        language: lang,
        originalNode: originalActions,
      });
    }, [actionIconSize, actionsRender, getCopyContent, lang, originalActions, tirmedChildren]);

    const originalBody = useMemo(
      () => (
        <SyntaxHighlighter
          animated={animated}
          className={classNames?.content}
          enableTransformer={enableTransformer}
          language={lang?.toLowerCase()}
          style={{
            height: '100%',
            ...customStyles?.content,
          }}
          theme={theme}
          variant={variant}
        >
          {tirmedChildren}
        </SyntaxHighlighter>
      ),
      [
        animated,
        enableTransformer,
        lang,
        theme,
        tirmedChildren,
        variant,
        customStyles?.content,
        customStyles?.content,
      ],
    );

    const displayName = useMemo(() => {
      if (fileName) return fileName;
      return getCodeLanguageDisplayName(language);
    }, [fileName, language]);

    const body = useMemo(() => {
      if (!bodyRender) return originalBody;
      return bodyRender({ content: tirmedChildren, language: lang, originalNode: originalBody });
    }, [bodyRender, lang, originalBody, tirmedChildren]);

    if (fullFeatured)
      return (
        <FullFeatured
          actionsRender={actionsRender}
          allowChangeLanguage={allowChangeLanguage}
          className={className}
          classNames={classNames}
          content={tirmedChildren}
          copyable={copyable}
          defaultExpand={defaultExpand}
          fileName={fileName}
          icon={icon}
          language={language}
          setLanguage={setLang}
          shadow={shadow}
          showLanguage={showLanguage}
          styles={customStyles}
          variant={variant}
          wrap={wrap}
          {...rest}
        >
          {body}
        </FullFeatured>
      );

    return (
      <Flexbox
        className={cx(variants({ shadow, variant, wrap }), className)}
        data-code-type="highlighter"
        {...rest}
      >
        <Flexbox align={'center'} className={styles.actions} flex={'none'} gap={4} horizontal>
          {actions}
        </Flexbox>
        {showLanguage && language && <Tag className={styles.lang}>{displayName}</Tag>}
        {body}
      </Flexbox>
    );
  },
);

Highlighter.displayName = 'Highlighter';

export default Highlighter;
