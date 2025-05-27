'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
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

    const tirmedChildren = children.trim();

    const originalActions = copyable && (
      <CopyButton content={tirmedChildren} glass size={actionIconSize} />
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize,
          content: tirmedChildren,
          language,
          originalNode: originalActions,
        })
      : originalActions;

    const originalBody = (
      <SyntaxHighlighter
        animated={animated}
        enableTransformer={enableTransformer}
        language={language?.toLowerCase()}
        theme={theme}
        variant={variant}
      >
        {tirmedChildren}
      </SyntaxHighlighter>
    );

    const body = bodyRender
      ? bodyRender({ content: tirmedChildren, language, originalNode: originalBody })
      : originalBody;

    if (fullFeatured)
      return (
        <FullFeatured
          actionsRender={actionsRender}
          allowChangeLanguage={allowChangeLanguage}
          className={className}
          content={tirmedChildren}
          copyable={copyable}
          defaultExpand={defaultExpand}
          fileName={fileName}
          icon={icon}
          language={language}
          shadow={shadow}
          showLanguage={showLanguage}
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
        {showLanguage && language && <Tag className={styles.lang}>{language.toLowerCase()}</Tag>}
        {body}
      </Flexbox>
    );
  },
);

Highlighter.displayName = 'Highlighter';

export default Highlighter;
