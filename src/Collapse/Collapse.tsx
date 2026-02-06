'use client';

import { Collapse as AntdCollapse, ConfigProvider } from 'antd';
import { cx, useThemeMode } from 'antd-style';
import { ChevronDown } from 'lucide-react';
import { isValidElement, memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { DEFAULT_PADDING, getPadding, styles, variants } from './style';
import type { CollapseProps } from './type';

const Collapse = memo<CollapseProps>(
  ({
    style,
    variant = 'filled',
    gap = 0,
    className,
    padding = DEFAULT_PADDING,
    size,
    collapsible = true,
    items,
    styles: customStyles,
    classNames,
    ref,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();

    const antdItems = useMemo(
      () =>
        items.map(({ icon, desc, label, ...itemRest }) => {
          let content = (
            <div
              className={cx(styles.title, !icon && !desc && classNames?.header, classNames?.title)}
              style={{
                ...(!icon && !desc ? customStyles?.header : {}),
                ...customStyles?.title,
              }}
            >
              {label}
            </div>
          );

          if (icon) {
            content = (
              <Flexbox
                horizontal
                className={cx(styles.title, !desc && classNames?.header)}
                gap={8}
                style={desc ? undefined : customStyles?.header}
              >
                {isValidElement(icon) ? icon : <Icon icon={icon} size={{ size: '1.1em' }} />}
                {content}
              </Flexbox>
            );
          }

          if (desc) {
            content = (
              <Flexbox className={classNames?.header} style={customStyles?.header}>
                {content}
                <div className={cx(styles.desc, classNames?.desc)} style={customStyles?.desc}>
                  {desc}
                </div>
              </Flexbox>
            );
          }

          return {
            label: content,
            ...itemRest,
          };
        }),
      [items, classNames, customStyles, styles],
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentPadding: getPadding(typeof padding === 'object' ? padding?.body : padding),
              headerPadding: getPadding(typeof padding === 'object' ? padding?.header : padding),
            },
          },
        }}
      >
        <AntdCollapse
          ghost
          className={cx(variants({ collapsible, gap: !!gap, isDarkMode, variant }), className)}
          collapsible={collapsible ? 'header' : 'icon'}
          items={antdItems}
          ref={ref}
          size={size}
          expandIcon={({ isActive }) => (
            <Icon
              className={styles.icon}
              icon={ChevronDown}
              size={16}
              style={{ rotate: isActive ? undefined : '-90deg' }}
            />
          )}
          style={{
            gap,
            ...style,
          }}
          {...rest}
        />
      </ConfigProvider>
    );
  },
);

Collapse.displayName = 'Collapse';

export default Collapse;
