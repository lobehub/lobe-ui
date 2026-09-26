'use client';

import { cx } from 'antd-style';
import { ChevronRight } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import A from '@/A';
import Icon from '@/Icon';

import { styles } from './style';
import type { BreadcrumbItem, BreadcrumbProps } from './type';

const renderTitle = (item: BreadcrumbItem): ReactNode => {
  if (item.href) {
    return (
      <A className={styles.link} href={item.href} onClick={item.onClick}>
        {item.title}
      </A>
    );
  }

  if (item.onClick) {
    return (
      <button className={styles.button} type="button" onClick={item.onClick}>
        {item.title}
      </button>
    );
  }

  return item.title;
};

const Breadcrumb = memo<BreadcrumbProps>(
  ({ className, classNames, items, ref, separator, styles: customStyles, ...rest }) => {
    const separatorNode = separator ?? <Icon icon={ChevronRight} size={14} />;

    return (
      <nav aria-label="breadcrumb" className={cx(styles.root, className)} ref={ref} {...rest}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                aria-current={isLast ? 'page' : undefined}
                className={cx(styles.item, classNames?.item)}
                key={item.key ?? index}
                style={customStyles?.item}
              >
                {renderTitle(item)}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cx(styles.separator, classNames?.separator)}
                    style={customStyles?.separator}
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
