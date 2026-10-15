'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { memo, useCallback, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import type { FlexboxProps } from '@/Flex';
import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

import { compactActionsCls, compactLangCls, prefix, styles, variantStyles } from './style';

interface DiffPanelProps extends Omit<FlexboxProps, 'children'> {
  actions?: ReactNode;
  additions: number;
  body: ReactNode;
  classNames?: {
    body?: string;
    header?: string;
  };
  dataCodeType: string;
  defaultExpand?: boolean;
  deletions: number;
  displayName: string;
  fileName?: string;
  fullFeatured?: boolean;
  showHeader?: boolean;
  styles?: {
    body?: CSSProperties;
    header?: CSSProperties;
  };
  variant?: 'filled' | 'outlined' | 'borderless';
}

export const DiffPanel = memo<DiffPanelProps>(
  ({
    actions,
    body,
    className,
    classNames,
    dataCodeType,
    defaultExpand = true,
    deletions,
    displayName,
    fileName,
    fullFeatured = true,
    showHeader = true,
    styles: customStyles,
    variant = 'filled',
    additions,
    ...rest
  }) => {
    const [expand, setExpand] = useState(defaultExpand);
    const rootStyles = [styles.root, variantStyles[variant]];

    const handleToggleExpand = useCallback(() => {
      setExpand((prev) => !prev);
    }, []);

    if (!fullFeatured)
      return (
        <Flexbox
          data-code-type={dataCodeType}
          width={'100%'}
          {...rest}
          {...styleProps(rootStyles, clsx(prefix, className), rest.style)}
        >
          <Flexbox
            horizontal
            align="center"
            flex="none"
            gap={4}
            {...styleProps(styles.actionsCompact, compactActionsCls)}
          >
            {actions}
          </Flexbox>
          {showHeader && <Tag className={compactLangCls}>{displayName}</Tag>}
          <div {...styleProps(styles.body, classNames?.body, customStyles?.body)}>{body}</div>
        </Flexbox>
      );

    return (
      <Flexbox
        data-code-type={dataCodeType}
        width={'100%'}
        {...rest}
        {...styleProps(rootStyles, clsx(prefix, className), rest.style)}
      >
        {showHeader && (
          <Flexbox
            horizontal
            align="center"
            gap={8}
            justify="space-between"
            padding={4}
            paddingInline={variant === 'borderless' ? 0 : undefined}
            onClick={handleToggleExpand}
            {...styleProps(
              [styles.header, variant === 'filled' && styles.headerFilled],
              classNames?.header,
              customStyles?.header,
            )}
          >
            <Flexbox
              horizontal
              align="center"
              className="language-title"
              flex={1}
              gap={4}
              justify="flex-start"
              paddingInline={8}
            >
              <MaterialFileTypeIcon
                fallbackUnknownType={false}
                filename={fileName || displayName}
                size={18}
                type="file"
                variant="raw"
              />
              <Text ellipsis fontSize={13}>
                {displayName}
              </Text>
            </Flexbox>
            <Flexbox horizontal align="center" flex="none" gap={8} onClick={stopPropagation}>
              {actions && (
                <Flexbox
                  horizontal
                  align="center"
                  flex="none"
                  gap={4}
                  {...styleProps(styles.actions, `panel-actions ${prefix}-actions`)}
                >
                  {actions}
                </Flexbox>
              )}
              {(deletions > 0 || additions > 0) && (
                <Flexbox horizontal align="center" gap={8}>
                  {deletions > 0 && <span {...stylex.props(styles.deletions)}>-{deletions}</span>}
                  {additions > 0 && <span {...stylex.props(styles.additions)}>+{additions}</span>}
                </Flexbox>
              )}
              <ActionIcon
                icon={expand ? ChevronDown : ChevronRight}
                size="small"
                onClick={handleToggleExpand}
              />
            </Flexbox>
          </Flexbox>
        )}
        <div
          {...styleProps(
            [
              styles.bodyRoot,
              !expand && styles.bodyCollapsed,
              styles.body,
              showHeader && variant !== 'borderless' && styles.bodyDivider,
            ],
            clsx(`${prefix}-body`, classNames?.body),
            customStyles?.body,
          )}
        >
          {body}
        </div>
      </Flexbox>
    );
  },
);

DiffPanel.displayName = 'DiffPanel';
