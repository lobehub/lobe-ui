'use client';

import { cx } from 'antd-style';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import { bodyVariants, headerVariants, variants } from '@/Highlighter/style';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

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
        justify={'flex-start'}
        paddingInline={8}
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
    styles: customStyles,
    classNames,
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
    const contentRef = useRef(content);

    useEffect(() => {
      contentRef.current = content;
    }, [content]);

    const getContent = useCallback(() => contentRef.current, []);

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
          className={cx(headerVariants({ variant }), classNames?.header)}
          horizontal
          justify={'space-between'}
          onClick={handleToggleExpand}
          style={customStyles?.header}
        >
          <MermaidHeaderLanguage
            fileName={fileName}
            language={language}
            showLanguage={showLanguage}
          />
          <Flexbox align={'center'} flex={'none'} gap={4} horizontal onClick={stopPropagation}>
            <Flexbox align={'center'} className={'panel-actions'} flex={'none'} gap={4} horizontal>
              {actions}
            </Flexbox>
            <ActionIcon
              icon={expand ? ChevronDown : ChevronRight}
              onClick={handleToggleExpand}
              size={'small'}
            />
          </Flexbox>
        </Flexbox>
        <Flexbox
          className={cx(bodyVariants({ expand }), classNames?.body)}
          style={customStyles?.body}
        >
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default MermaidFullFeatured;
