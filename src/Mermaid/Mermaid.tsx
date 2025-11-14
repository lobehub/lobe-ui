'use client';

import { cva } from 'class-variance-authority';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
import { useStyles } from '@/Highlighter/style';
import Tag from '@/Tag';

import FullFeatured from './FullFeatured';
import SyntaxMermaid from './SyntaxMermaid';
import { MermaidProps } from './type';

const Mermaid = memo<MermaidProps>(
  ({
    children,
    actionIconSize,
    fullFeatured,
    copyable = true,
    showLanguage = true,
    language = 'mermaid',
    style,
    variant = 'filled',
    shadow,
    enablePanZoom = true,
    defaultExpand = true,
    className,
    bodyRender,
    fileName,
    actionsRender,
    theme,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

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
              true: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const tirmedChildren = children.trim();
    const copyContentRef = useRef(tirmedChildren);

    useEffect(() => {
      copyContentRef.current = tirmedChildren;
    }, [tirmedChildren]);

    const getCopyContent = useCallback(() => copyContentRef.current, []);

    const originalActions = useMemo(() => {
      if (!copyable) return null;
      return <CopyButton content={getCopyContent} size={actionIconSize} />;
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
        <SyntaxMermaid enablePanZoom={enablePanZoom} theme={theme} variant={variant}>
          {tirmedChildren}
        </SyntaxMermaid>
      ),
      [enablePanZoom, theme, tirmedChildren, variant],
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
          content={tirmedChildren}
          copyable={copyable}
          defaultExpand={defaultExpand}
          fileName={fileName}
          language={language}
          shadow={shadow}
          showLanguage={showLanguage}
          style={style}
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
        <Flexbox align={'center'} className={styles.actions} flex={'none'} gap={4} horizontal>
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
