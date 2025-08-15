'use client';

import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { getCodeLanguageDisplayName, getCodeLanguageFilename } from '@/Highlighter/const';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Text from '@/Text';

import LangSelect from './LangSelect';
import { useStyles } from './style';
import { HighlighterProps } from './type';

interface HighlighterFullFeaturedProps
  extends Omit<HighlighterProps, 'children' | 'bodyRender' | 'enableTransformer'> {
  content: string;
  setLanguage?: (language: string) => void;
}

export const HighlighterFullFeatured = memo<HighlighterFullFeaturedProps & { children: ReactNode }>(
  ({
    content,
    language,
    setLanguage,
    showLanguage,
    className,
    style,
    allowChangeLanguage = false,
    fileName,
    icon,
    actionsRender,
    copyable,
    variant,
    shadow,
    wrap,
    defaultExpand = true,
    children,
    ...rest
  }) => {
    const [expand, setExpand] = useState(defaultExpand);
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
              true: null,
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
      ? actionsRender({
          actionIconSize: 'small',
          content,
          language,
          originalNode: originalActions,
        })
      : originalActions;

    const displayName = useMemo(() => {
      if (fileName) return fileName;
      return getCodeLanguageDisplayName(language);
    }, [fileName, language]);

    const filetype = useMemo(() => {
      if (fileName) return fileName;
      return getCodeLanguageFilename(language);
    }, [fileName, language]);

    return (
      <Flexbox
        className={cx(variants({ shadow, variant, wrap }), className)}
        data-code-type="highlighter"
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
          {allowChangeLanguage && !fileName ? (
            showLanguage && <LangSelect onSelect={setLanguage} value={language.toLowerCase()} />
          ) : (
            <Flexbox align={'center'} className={'languageTitle'} gap={4} horizontal>
              {icon || (
                <MaterialFileTypeIcon
                  fallbackUnknownType={false}
                  filename={filetype}
                  size={18}
                  type={'file'}
                  variant={'raw'}
                />
              )}
              <Text ellipsis fontSize={13}>
                {displayName}
              </Text>
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

export default HighlighterFullFeatured;
