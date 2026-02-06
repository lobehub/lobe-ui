'use client';

import { cx } from 'antd-style';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import { styles, variants } from '@/Highlighter/style';
import Tag from '@/Tag';

import FullFeatured from './FullFeatured';
import SyntaxMermaid from './SyntaxMermaid';
import type { MermaidProps } from './type';

const Mermaid = memo<MermaidProps>(
  ({
    actionIconSize,
    animated,
    bodyRender,
    children,
    classNames,
    className,
    copyable = true,
    defaultExpand = true,
    fileName,
    fullFeatured,
    language = 'mermaid',
    actionsRender,
    shadow,
    showLanguage = true,
    style,
    styles: customStyles,
    theme,
    variant = 'filled',
    ...rest
  }) => {
    const tirmedChildren = children.trim();
    const copyContentRef = useRef(tirmedChildren);

    useEffect(() => {
      copyContentRef.current = tirmedChildren;
    }, [tirmedChildren]);

    const getCopyContent = useCallback(() => copyContentRef.current, []);

    const originalActions = useMemo(() => {
      if (!copyable) return null;
      return (
        <CopyButton content={getCopyContent} size={actionIconSize || { blockSize: 28, size: 16 }} />
      );
    }, [actionIconSize, copyable, getCopyContent]);

    const actions = useMemo(() => {
      if (!actionsRender) return originalActions;
      return actionsRender({
        actionIconSize,
        content: tirmedChildren,
        getContent: getCopyContent,
        originalNode: originalActions,
      });
    }, [actionIconSize, actionsRender, getCopyContent, originalActions, tirmedChildren]);

    const defaultBody = useMemo(
      () => (
        <SyntaxMermaid
          animated={animated}
          className={classNames?.content}
          style={customStyles?.content}
          theme={theme}
          variant={variant}
        >
          {tirmedChildren}
        </SyntaxMermaid>
      ),
      [animated, theme, tirmedChildren, variant, classNames?.content, customStyles?.content],
    );

    const body = useMemo(() => {
      if (!bodyRender) return defaultBody;
      return bodyRender({ content: tirmedChildren, originalNode: defaultBody });
    }, [bodyRender, defaultBody, tirmedChildren]);

    if (fullFeatured)
      return (
        <FullFeatured
          actionsRender={actionsRender}
          className={className}
          classNames={classNames}
          content={tirmedChildren}
          copyable={copyable}
          defaultExpand={defaultExpand}
          fileName={fileName}
          language={language}
          shadow={shadow}
          showLanguage={showLanguage}
          style={style}
          styles={customStyles}
          variant={variant}
          {...rest}
        >
          {body}
        </FullFeatured>
      );

    return (
      <div
        className={cx(variants({ shadow, variant }), className)}
        data-code-type="mermaid"
        style={style}
        {...rest}
      >
        <Flexbox horizontal align={'center'} className={styles.actions} flex={'none'} gap={4}>
          {actions}
        </Flexbox>
        {showLanguage && <Tag className={styles.lang}>{language.toLowerCase()}</Tag>}
        {body}
      </div>
    );
  },
);

Mermaid.displayName = 'Mermaid';

export default Mermaid;

export { type MermaidProps } from './type';
