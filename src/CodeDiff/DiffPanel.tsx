'use client';

import { cx } from 'antd-style';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { memo, useCallback, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import type { FlexboxProps } from '@/Flex';
import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Tag from '@/Tag';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

import { bodyVariants, headerVariants, prefix, styles, variants } from './style';

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

    const handleToggleExpand = useCallback(() => {
      setExpand((prev) => !prev);
    }, []);

    if (!fullFeatured)
      return (
        <Flexbox
          className={cx(variants({ variant }), className)}
          data-code-type={dataCodeType}
          {...rest}
        >
          <Flexbox horizontal align="center" className={styles.actionsCompact} flex="none" gap={4}>
            {actions}
          </Flexbox>
          {showHeader && <Tag className={styles.lang}>{displayName}</Tag>}
          <div className={cx(styles.body, classNames?.body)} style={customStyles?.body}>
            {body}
          </div>
        </Flexbox>
      );

    return (
      <Flexbox
        className={cx(variants({ variant }), className)}
        data-code-type={dataCodeType}
        {...rest}
      >
        {showHeader && (
          <Flexbox
            horizontal
            align="center"
            className={cx(headerVariants({ variant }), classNames?.header)}
            justify="space-between"
            style={customStyles?.header}
            onClick={handleToggleExpand}
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
                  className={cx('panel-actions', `${prefix}-actions`, styles.actions)}
                  flex="none"
                  gap={4}
                >
                  {actions}
                </Flexbox>
              )}
              {(deletions > 0 || additions > 0) && (
                <Flexbox horizontal className={styles.stats} gap={8}>
                  {deletions > 0 && <span className={styles.deletions}>-{deletions}</span>}
                  {additions > 0 && <span className={styles.additions}>+{additions}</span>}
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
          className={cx(bodyVariants({ expand }), `${prefix}-body`, styles.body, classNames?.body)}
          style={customStyles?.body}
        >
          {body}
        </div>
      </Flexbox>
    );
  },
);

DiffPanel.displayName = 'DiffPanel';
