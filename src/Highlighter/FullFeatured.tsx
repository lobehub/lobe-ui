'use client';

import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { getCodeLanguageDisplayName, getCodeLanguageFilename } from '@/Highlighter/const';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Text from '@/Text';

import LangSelect from './LangSelect';
import { useStyles } from './style';
import { HighlighterProps } from './type';

interface HeaderLanguageProps {
  allowChangeLanguage: boolean;
  displayName: string;
  fileName?: string;
  filetype: string;
  icon?: ReactNode;
  language: string;
  setLanguage?: (language: string) => void;
  showLanguage?: boolean;
}

const HeaderLanguage = memo<HeaderLanguageProps>(
  ({
    allowChangeLanguage,
    displayName,
    fileName,
    filetype,
    icon,
    language,
    setLanguage,
    showLanguage,
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
        {allowChangeLanguage && !fileName ? (
          <LangSelect onSelect={setLanguage} value={language.toLowerCase()} />
        ) : (
          <>
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
          </>
        )}
      </Flexbox>
    );
  },
  (prev, next) =>
    prev.allowChangeLanguage === next.allowChangeLanguage &&
    prev.displayName === next.displayName &&
    prev.fileName === next.fileName &&
    prev.filetype === next.filetype &&
    prev.icon === next.icon &&
    prev.language === next.language &&
    prev.setLanguage === next.setLanguage &&
    prev.showLanguage === next.showLanguage,
);

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
        language,
        originalNode: originalActions,
      });
    }, [actionsRender, content, getContent, language, originalActions]);

    const displayName = useMemo(() => {
      if (fileName) return fileName;
      return getCodeLanguageDisplayName(language);
    }, [fileName, language]);

    const filetype = useMemo(() => {
      if (fileName) return fileName;
      return getCodeLanguageFilename(language);
    }, [fileName, language]);

    const handleToggleExpand = useCallback(() => {
      setExpand((prev) => !prev);
    }, []);

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
            onClick={handleToggleExpand}
            size={'small'}
          />
          <HeaderLanguage
            allowChangeLanguage={allowChangeLanguage}
            displayName={displayName}
            fileName={fileName}
            filetype={filetype}
            icon={icon}
            language={language}
            setLanguage={setLanguage}
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

export default HighlighterFullFeatured;
