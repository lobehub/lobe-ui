'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import A from '@/A';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { BreadcrumbItem, BreadcrumbProps } from './type';

const renderTitle = (item: BreadcrumbItem): ReactNode => {
  if (item.href) {
    return (
      <A {...stylex.props(styles.link)} href={item.href} onClick={item.onClick}>
        {item.title}
      </A>
    );
  }

  if (item.onClick) {
    return (
      <button {...stylex.props(styles.button)} type="button" onClick={item.onClick}>
        {item.title}
      </button>
    );
  }

  return item.title;
};

const Breadcrumb = memo<BreadcrumbProps>(
  ({ className, classNames, items, ref, separator, style, styles: customStyles, ...rest }) => {
    const separatorNode = separator ?? <Icon icon={ChevronRight} size={14} />;

    return (
      <nav
        aria-label="breadcrumb"
        ref={ref}
        {...rest}
        {...styleProps(styles.root, clsx('lobe-breadcrumb', className), style)}
      >
        <ol {...stylex.props(styles.list)}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                aria-current={isLast ? 'page' : undefined}
                key={item.key ?? index}
                {...styleProps(styles.item, classNames?.item, customStyles?.item)}
              >
                {renderTitle(item)}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    {...styleProps(
                      styles.separator,
                      classNames?.separator,
                      customStyles?.separator,
                    )}
                  >
                    {separatorNode}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
