'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
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
    enableNonPreviewWheelZoom = true,
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

    const originalActions = copyable && (
      <CopyButton content={tirmedChildren} size={actionIconSize} />
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize,
          content: children,
          originalNode: originalActions,
        })
      : originalActions;

    const defaultBody = (
      <SyntaxMermaid
        enableNonPreviewWheelZoom={enableNonPreviewWheelZoom}
        enablePanZoom={enablePanZoom}
        theme={theme}
        variant={variant}
      >
        {tirmedChildren}
      </SyntaxMermaid>
    );

    const body = bodyRender
      ? bodyRender({ content: tirmedChildren, originalNode: defaultBody })
      : defaultBody;

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
