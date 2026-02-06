'use client';

import { cx } from 'antd-style';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import { getCodeLanguageDisplayName } from '@/Highlighter/const';
import Tag from '@/Tag';

import FullFeatured from './FullFeatured';
import { styles, variants } from './style';
import SyntaxHighlighter from './SyntaxHighlighter';
import { type HighlighterProps } from './type';

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
    const [lang, setLang] = useState(language);

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
      return (
        <CopyButton
          glass
          content={getCopyContent}
          size={actionIconSize || { blockSize: 28, size: 16 }}
        />
      );
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
          theme={theme}
          variant={variant}
          style={{
            height: '100%',
            ...customStyles?.content,
          }}
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
        <Flexbox horizontal align={'center'} className={styles.actions} flex={'none'} gap={4}>
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
