'use client';

import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { useStyles } from '@/Highlighter/style';

import { MermaidProps } from './type';

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

    const originalActions = copyable && <CopyButton content={content} size={'small'} />;

    const actions = actionsRender
      ? actionsRender({ actionIconSize: 'small', content, originalNode: originalActions })
      : originalActions;

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
            onClick={() => setExpand(!expand)}
            size={'small'}
          />
          {showLanguage && (
            <Flexbox
              align={'center'}
              className={styles.select}
              gap={2}
              horizontal
              justify={'center'}
            >
              {fileName || language.toLowerCase()}
            </Flexbox>
          )}
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
