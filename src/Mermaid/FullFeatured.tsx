'use client';

import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { useStyles } from '@/Highlighter/style';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Text from '@/Text';

import { MermaidProps } from './type';

const MermaidHeaderLanguage = memo(
  ({
    fileName,
    language,
    showLanguage,
  }: {
    fileName?: string;
    language: string;
    showLanguage?: boolean;
  }) => {
    if (!showLanguage) return null;

    return (
      <Flexbox
        align={'center'}
        className={'languageTitle'}
        flex={1}
        gap={4}
        horizontal
        justify={'center'}
      >
        <MaterialFileTypeIcon
          fallbackUnknownType={false}
          filename={fileName || language}
          size={18}
          type={'file'}
          variant={'raw'}
        />

        <Text ellipsis fontSize={13}>
          {fileName || 'Mermaid'}
        </Text>
      </Flexbox>
    );
  },
  (prev, next) =>
    prev.fileName === next.fileName &&
    prev.language === next.language &&
    prev.showLanguage === next.showLanguage,
);

export interface MermaidFullFeaturedProps extends Omit<MermaidProps, 'children'> {
  children: ReactNode;
  content: string;
}

export const MermaidFullFeatured = memo<MermaidFullFeaturedProps>(
  ({
    showLanguage,
    content,
    children,
    className,
    copyable,
    actionsRender,
    style,
    variant,
    shadow,
    language = 'mermaid',
    fileName,
    defaultExpand = true,
    ...rest
  }) => {
    const [expand, setExpand] = useState(defaultExpand);
    const { styles, cx } = useStyles('block');
    const contentRef = useRef(content);

    useEffect(() => {
      contentRef.current = content;
    }, [content]);

    const getContent = useCallback(() => contentRef.current, []);
    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'filled',
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
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const headerVariants = useMemo(
      () =>
        cva(styles.headerRoot, {
          defaultVariants: {
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: cx(styles.headerFilled, styles.headerOutlined),
              outlined: styles.headerOutlined,
              borderless: styles.headerBorderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const bodyVariants = useMemo(
      () =>
        cva(styles.bodyRoot, {
          defaultVariants: {
            expand: true,
          },
          variants: {
            expand: {
              false: styles.bodyCollapsed,
              true: styles.bodyExpand,
            },
          },
        }),
      [styles],
    );

    const originalActions = useMemo(() => {
      if (!copyable) return null;
      return <CopyButton content={getContent} size={'small'} />;
    }, [copyable, getContent]);

    const actions = useMemo(() => {
      if (!actionsRender) return originalActions;
      return actionsRender({
        actionIconSize: 'small',
        content,
        getContent,
        originalNode: originalActions,
      });
    }, [actionsRender, content, getContent, originalActions]);

    const handleToggleExpand = useCallback(() => {
      setExpand((prev) => !prev);
    }, []);

    return (
      <Flexbox
        className={cx(variants({ shadow, variant }), className)}
        data-code-type="mermaid"
        style={style}
        {...rest}
      >
        <Flexbox
          align={'center'}
          className={headerVariants({ variant })}
          horizontal
          justify={'space-between'}
        >
          <ActionIcon
            icon={expand ? ChevronDown : ChevronRight}
            onClick={handleToggleExpand}
            size={'small'}
          />
          <MermaidHeaderLanguage
            fileName={fileName}
            language={language}
            showLanguage={showLanguage}
          />
          <Flexbox align={'center'} flex={'none'} gap={4} horizontal>
            {actions}
          </Flexbox>
        </Flexbox>
        <Flexbox className={bodyVariants({ expand })}>{children}</Flexbox>
      </Flexbox>
    );
  },
);

export default MermaidFullFeatured;
