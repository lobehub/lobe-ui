'use client';

import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import {
  bodyStyles,
  expandCls,
  headerFlexProps,
  headerStyles,
  rootClassName,
  rootStyles,
} from '@/Highlighter/style';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

import { type MermaidProps } from './type';

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
        horizontal
        align={'center'}
        className={'language-title'}
        flex={1}
        gap={4}
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
        data-code-type="mermaid"
        width={'100%'}
        {...rest}
        {...styleProps(rootStyles({ shadow, variant }), rootClassName(false, className), style)}
      >
        <Flexbox
          horizontal
          align={'center'}
          justify={'space-between'}
          onClick={handleToggleExpand}
          {...headerFlexProps(variant)}
          {...styleProps(headerStyles(variant), classNames?.header, customStyles?.header)}
        >
          <MermaidHeaderLanguage
            fileName={fileName}
            language={language}
            showLanguage={showLanguage}
          />
          <Flexbox horizontal align={'center'} flex={'none'} gap={4} onClick={stopPropagation}>
            <Flexbox horizontal align={'center'} className={'panel-actions'} flex={'none'} gap={4}>
              {actions}
            </Flexbox>
            <ActionIcon
              icon={expand ? ChevronDown : ChevronRight}
              size={'small'}
              onClick={handleToggleExpand}
            />
          </Flexbox>
        </Flexbox>
        <Flexbox
          height={expand ? undefined : 0}
          {...styleProps(
            bodyStyles(expand, variant),
            clsx(expand && expandCls, classNames?.body),
            customStyles?.body,
          )}
        >
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default MermaidFullFeatured;
