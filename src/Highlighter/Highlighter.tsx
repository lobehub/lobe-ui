'use client';

import clsx from 'clsx';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import { getCodeLanguageDisplayName } from '@/Highlighter/const';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';
import { toDataAttributes } from '@/utils/bem';

import FullFeatured from './FullFeatured';
import { highlighterClasses } from './stable';
import { actionsHoverCls, langHoverCls, rootClassName, rootStyles, styles } from './style';
import { SyntaxHighlighterImpl } from './SyntaxHighlighter';
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
        <SyntaxHighlighterImpl
          animated={animated}
          className={clsx(highlighterClasses('content'), classNames?.content)}
          enableTransformer={enableTransformer}
          language={lang?.toLowerCase()}
          style={customStyles?.content}
          theme={theme}
          variant={variant}
          xstyle={styles.content}
        >
          {tirmedChildren}
        </SyntaxHighlighterImpl>
      ),
      [
        animated,
        enableTransformer,
        lang,
        theme,
        tirmedChildren,
        variant,
        classNames?.content,
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
        data-code-type="highlighter"
        width={'100%'}
        {...toDataAttributes({ shadow, variant, wrap })}
        {...rest}
        {...styleProps(rootStyles({ shadow, variant }), rootClassName(wrap, className), rest.style)}
      >
        <Flexbox
          horizontal
          align={'center'}
          flex={'none'}
          gap={4}
          {...styleProps(styles.actions, clsx(actionsHoverCls, highlighterClasses('actions')))}
        >
          {actions}
        </Flexbox>
        {showLanguage && language && (
          <Tag className={clsx(langHoverCls, highlighterClasses('language'))}>{displayName}</Tag>
        )}
        {body}
      </Flexbox>
    );
  },
);

Highlighter.displayName = 'Highlighter';

export default Highlighter;
